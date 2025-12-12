import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. Create a Default Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'École Démo Goma',
      phone: '+243999000111', // Demo phone number
      email: 'demo@educationgoma.com',
      commune: 'Goma',
      type: 'private',
      status: 'active', // Demo tenant is already validated
      isPhoneVerified: true,
      domain: 'demo.educationgoma.com',
    },
  });
  console.log(`✅ Tenant created: ${tenant.name}`);

  // 1.1 Create Super Admin User
  const hashedPassword = await bcrypt.hash('Obed2321Jtb', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'obedburindi@gmail.com',
      password: hashedPassword,
      firstName: 'Obed',
      lastName: 'Burindi',
      tenantId: tenant.id,
      isActive: true,
    },
  });
  console.log(`✅ Admin user created: ${adminUser.email}`);

  // 2. Define Permissions based on the Matrix
  // We normalize them to a standard format: resource.action
  const permissionsList = [
    // Global / Admin
    { name: 'all.manage', description: 'Full access to everything' },

    // Students
    { name: 'student.create', description: 'Create students' },
    { name: 'student.view', description: 'View students' },
    { name: 'student.edit', description: 'Edit students' },
    { name: 'student.delete', description: 'Delete students' },

    // Classes
    { name: 'class.create', description: 'Create classes' },
    { name: 'class.view', description: 'View classes' },
    { name: 'class.edit', description: 'Edit classes' },
    { name: 'class.delete', description: 'Delete classes' },

    // Teachers (Profs)
    { name: 'teacher.create', description: 'Create teachers' },
    { name: 'teacher.view', description: 'View teachers' },
    { name: 'teacher.edit', description: 'Edit teachers' },
    { name: 'teacher.delete', description: 'Delete teachers' },

    // Grades (Notes)
    { name: 'grade.create', description: 'Create grades' },
    { name: 'grade.view', description: 'View grades' },
    { name: 'grade.edit', description: 'Edit grades' },
    { name: 'grade.delete', description: 'Delete grades' },

    // Attendance (Présences)
    { name: 'attendance.create', description: 'Create attendance records' },
    { name: 'attendance.view', description: 'View attendance records' },
    { name: 'attendance.edit', description: 'Edit attendance records' },
    { name: 'attendance.delete', description: 'Delete attendance records' },

    // Finance (Frais, Paiements)
    { name: 'finance.create', description: 'Create financial records' },
    { name: 'finance.view', description: 'View financial records' },
    { name: 'finance.edit', description: 'Edit financial records' },
    { name: 'finance.delete', description: 'Delete financial records' },
  ];

  // Upsert permissions
  const dbPermissions: Record<string, string> = {};
  for (const p of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
    dbPermissions[p.name] = perm.id;
  }
  console.log(`✅ Permissions seeded: ${Object.keys(dbPermissions).length}`);

  // 3. Define Roles and assign Permissions
  const rolesData = [
    {
      name: 'Admin',
      permissions: ['all.manage'],
    },
    {
      name: 'Directeur',
      permissions: [
        'class.create', 'teacher.create', // Create
        'student.view', 'class.view', 'teacher.view', 'grade.view', 'attendance.view', 'finance.view', // View All (simplified)
        'grade.edit', 'attendance.edit', // Edit
        'class.delete', // Delete (Limited)
      ],
    },
    {
      name: 'Secrétaire',
      permissions: [
        'student.create', 'class.create',
        'student.view', 'class.view', 'attendance.view',
        'student.edit', 'class.edit',
        'student.delete',
      ],
    },
    {
      name: 'Surveillant',
      permissions: [
        'attendance.create',
        'student.view', 'class.view',
        'attendance.edit',
      ],
    },
    {
      name: 'Enseignant',
      permissions: [
        'grade.create',
        'student.view', // Limited to their class in logic, but general view perm here
        'grade.edit',
      ],
    },
    {
      name: 'Comptable',
      permissions: [
        'finance.create',
        'finance.view',
        'finance.edit',
      ],
    },
    {
      name: 'Parent',
      permissions: [
        'grade.view', 'attendance.view', // Limited to child in logic
      ],
    },
    {
      name: 'Élève',
      permissions: [
        'grade.view', // Limited to self in logic
      ],
    },
  ];

  for (const roleDef of rolesData) {
    const role = await prisma.role.create({
      data: {
        name: roleDef.name,
        tenantId: tenant.id,
        rolePermissions: {
          create: roleDef.permissions.map((permName) => ({
            permission: {
              connect: { id: dbPermissions[permName] || dbPermissions['all.manage'] }, // Fallback if missing, but shouldn't happen
            },
          })),
        },
      },
    });
    console.log(`✅ Role created: ${role.name}`);
    
    // Assign Admin role to the admin user
    if (role.name === 'Admin') {
      await prisma.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: role.id,
        },
      });
      console.log(`✅ Admin role assigned to ${adminUser.email}`);
    }
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
