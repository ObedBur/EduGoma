import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

faker.seed(42); // Seed pour des résultats reproductibles

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

// Mot de passe fixe pour le dev — À NE PAS UTILISER EN PRODUCTION
const DEV_PASSWORD = 'Admin@2024';

// Communes de Goma
const COMMUNES = ['Goma', 'Karisimbi', 'Mugunga', 'Nyiragongo'] as const;
const SCHOOL_TYPES = ['private', 'conventionned', 'community', 'public'] as const;

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Créer le tenant principal (école admin)
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Institut Technique de Goma',
      phone: faker.phone.number({ style: 'national' }),
      email: faker.internet.email().toLowerCase(),
      commune: faker.helpers.arrayElement(COMMUNES),
      type: 'private',
      status: 'active',
      domain: 'itg.educationgoma.com',
    },
  });
  console.log(`✅ Tenant créé: ${tenant.name}`);

  // 2. Créer l'admin principal avec faker
  const adminEmail = 'admin@edugoma.cd';
  const hashedPassword = await bcrypt.hash(DEV_PASSWORD, BCRYPT_ROUNDS);

  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'EduGoma',
      tenantId: tenant.id,
      isActive: true,
    },
  });
  console.log(`✅ Admin créé: ${adminUser.email} / ${DEV_PASSWORD}`);

  // 3. Créer 3 autres utilisateurs faker pour test
  const fakeUsers = await Promise.all(
    Array.from({ length: 3 }, async () => {
      const gender = faker.helpers.arrayElement(['male', 'female'] as const);
      const firstName = faker.person.firstName(gender);
      const lastName = faker.person.lastName(gender);

      return prisma.user.create({
        data: {
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
          phone: faker.phone.number({ style: 'national' }),
          password: hashedPassword, // Même mot de passe pour faciliter les tests
          firstName,
          lastName,
          tenantId: tenant.id,
          isActive: true,
        },
      });
    }),
  );
  console.log(`✅ ${fakeUsers.length} utilisateurs faker créés`);

  // 4. Permissions
  const permissionsList = [
    { name: 'all.manage', description: 'Full access to everything' },
    { name: 'student.create', description: 'Create students' },
    { name: 'student.view', description: 'View students' },
    { name: 'student.edit', description: 'Edit students' },
    { name: 'student.delete', description: 'Delete students' },
    { name: 'class.create', description: 'Create classes' },
    { name: 'class.view', description: 'View classes' },
    { name: 'class.edit', description: 'Edit classes' },
    { name: 'class.delete', description: 'Delete classes' },
    { name: 'teacher.create', description: 'Create teachers' },
    { name: 'teacher.view', description: 'View teachers' },
    { name: 'teacher.edit', description: 'Edit teachers' },
    { name: 'teacher.delete', description: 'Delete teachers' },
    { name: 'grade.create', description: 'Create grades' },
    { name: 'grade.view', description: 'View grades' },
    { name: 'grade.edit', description: 'Edit grades' },
    { name: 'grade.delete', description: 'Delete grades' },
    { name: 'attendance.create', description: 'Create attendance records' },
    { name: 'attendance.view', description: 'View attendance records' },
    { name: 'attendance.edit', description: 'Edit attendance records' },
    { name: 'attendance.delete', description: 'Delete attendance records' },
    { name: 'finance.create', description: 'Create financial records' },
    { name: 'finance.view', description: 'View financial records' },
    { name: 'finance.edit', description: 'Edit financial records' },
    { name: 'finance.delete', description: 'Delete financial records' },
  ];

  const dbPermissions: Record<string, string> = {};
  for (const p of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
    dbPermissions[p.name] = perm.id;
  }
  console.log(`✅ ${Object.keys(dbPermissions).length} permissions seedées`);

  // 5. Rôles
  const rolesData = [
    { name: 'Admin', permissions: ['all.manage'] },
    {
      name: 'Directeur',
      permissions: [
        'class.create', 'teacher.create',
        'student.view', 'class.view', 'teacher.view', 'grade.view', 'attendance.view', 'finance.view',
        'grade.edit', 'attendance.edit',
        'class.delete',
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
      permissions: ['grade.create', 'student.view', 'grade.edit'],
    },
    {
      name: 'Comptable',
      permissions: ['finance.create', 'finance.view', 'finance.edit'],
    },
    { name: 'Parent', permissions: ['grade.view', 'attendance.view'] },
    { name: 'Élève', permissions: ['grade.view'] },
  ];

  const adminRole = await prisma.role.findFirst({
    where: { name: 'Admin', tenantId: tenant.id },
  });

  for (const roleDef of rolesData) {
    const role = await prisma.role.create({
      data: {
        name: roleDef.name,
        tenantId: tenant.id,
        rolePermissions: {
          create: roleDef.permissions.map((permName) => ({
            permission: {
              connect: { id: dbPermissions[permName] },
            },
          })),
        },
      },
    });

    // Assigner le rôle Admin à l'admin user
    if (role.name === 'Admin') {
      await prisma.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: role.id,
        },
      });
      console.log(`✅ Rôle Admin assigné à ${adminUser.email}`);
    }
  }
  console.log(`✅ ${rolesData.length} rôles créés`);

  // 6. Créer quelques écoles faker supplémentaires (pour les tests admin)
  const fakeTenants = await Promise.all(
    Array.from({ length: 4 }, async () => {
      const schoolName = `École ${faker.location.city()} ${faker.string.alpha(2).toUpperCase()}`;
      return prisma.tenant.create({
        data: {
          name: schoolName,
          phone: faker.phone.number({ style: 'national' }),
          email: faker.internet.email().toLowerCase(),
          commune: faker.helpers.arrayElement(COMMUNES),
          type: faker.helpers.arrayElement(SCHOOL_TYPES),
          status: faker.helpers.arrayElement(['pending', 'active', 'pending']),
          
        },
      });
    }),
  );
  console.log(`✅ ${fakeTenants.length} écoles faker créées`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 IDENTIFIANTS DE CONNEXION :');
  console.log(`   Email    : ${adminEmail}`);
  console.log(`   Mot de passe : ${DEV_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
