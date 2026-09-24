import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

faker.seed(42); // Seed pour des résultats reproductibles

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

// Mot de passe fixe pour le dev — À NE PAS UTILISER EN PRODUCTION
const DEV_PASSWORD = 'Admin@2024';

// Communes de Goma
const COMMUNES = ['Goma', 'Karisimbi', 'Mugunga', 'Nyiragongo'] as const;

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Créer le tenant principal (école admin)
  const tenant = await prisma.tenant.upsert({
    where: { name: 'Institut Technique de Goma' },
    update: {},
    create: {
      name: 'Institut Technique de Goma',
      phone: faker.phone.number({ style: 'national' }),
      email: faker.internet.email().toLowerCase(),
      commune: faker.helpers.arrayElement(COMMUNES),
      type: 'private',
      status: 'active',
      domain: 'itg.educationgoma.com',
    },
  });
  console.log(`✅ Tenant: ${tenant.name}`);

  // 2. Créer l'admin principal avec faker
  const adminEmail = 'admin@edugoma.cd';
  const hashedPassword = await bcrypt.hash(DEV_PASSWORD, BCRYPT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, isActive: true },
    create: {
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'EduGoma',
      tenantId: tenant.id,
      isActive: true,
    },
  });
  console.log(`✅ Admin: ${adminUser.email} / ${DEV_PASSWORD}`);

  // 3. Créer 3 autres utilisateurs faker pour test
  const existingCount = await prisma.user.count({ where: { tenantId: tenant.id } });
  if (existingCount <= 1) {
    const fakeUsers = await Promise.all(
      Array.from({ length: 3 }, async () => {
        const gender = faker.helpers.arrayElement(['male', 'female'] as const);
        const firstName = faker.person.firstName(gender);
        const lastName = faker.person.lastName(gender);

        return prisma.user.create({
          data: {
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            phone: faker.phone.number({ style: 'national' }),
            password: hashedPassword,
            firstName,
            lastName,
            tenantId: tenant.id,
            isActive: true,
          },
        });
      }),
    );
    console.log(`✅ ${fakeUsers.length} utilisateurs faker créés`);
  } else {
    console.log(`⏭️  Utilisateurs déjà présents (${existingCount}), skip`);
  }

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
    { name: 'Admin', level: 2, permissions: ['all.manage'] },
    {
      name: 'Directeur',
      permissions: [
        'class.create',
        'teacher.create',
        'student.view',
        'class.view',
        'teacher.view',
        'grade.view',
        'attendance.view',
        'finance.view',
        'grade.edit',
        'attendance.edit',
        'class.delete',
      ],
    },
    {
      name: 'Secrétaire',
      permissions: [
        'student.create',
        'class.create',
        'student.view',
        'class.view',
        'attendance.view',
        'student.edit',
        'class.edit',
        'student.delete',
      ],
    },
    {
      name: 'Surveillant',
      permissions: ['attendance.create', 'student.view', 'class.view', 'attendance.edit'],
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

  const existingRoles = await prisma.role.findMany({
    where: { tenantId: tenant.id },
    select: { name: true },
  });
  const existingRoleNames = new Set(existingRoles.map((r) => r.name));

  let rolesCreated = 0;
  for (const roleDef of rolesData) {
    if (existingRoleNames.has(roleDef.name)) continue;

    const role = await prisma.role.create({
      data: {
        name: roleDef.name,
        level: roleDef.level,
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
    rolesCreated++;

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

  // 5b. Rôle Super Admin (level=1)
  let superAdminRole = await prisma.role.findFirst({
    where: { name: 'Super Admin', tenantId: tenant.id },
  });
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: 'Super Admin',
        level: 1,
        tenantId: tenant.id,
        rolePermissions: {
          create: [{ permission: { connect: { id: dbPermissions['all.manage'] } } }],
        },
      },
    });
    console.log(`✅ Rôle Super Admin créé`);
  } else if (superAdminRole.level !== 1) {
    await prisma.role.update({
      where: { id: superAdminRole.id },
      data: { level: 1 },
    });
  }

  const superAdminLink = await prisma.userRole.findFirst({
    where: { userId: adminUser.id, roleId: superAdminRole.id },
  });
  if (!superAdminLink) {
    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }
  console.log(`✅ Rôle Super Admin assigné à ${adminUser.email}`);

  console.log(`✅ ${rolesCreated} nouveaux rôles créés (${existingRoleNames.size} existants)`);

  // 6. Écoles Goma réalistes (idempotent — upsert par nom)
  const GOMA_SCHOOLS: Array<{
    name: string;
    commune: string;
    type: string;
    status: string;
    subscriptionStatus?: string;
    subscriptionPaidAt?: Date | null;
    validatedAt?: Date | null;
    domain: string;
    users: Array<{ email: string; firstName: string; lastName: string }>;
  }> = [
    {
      name: 'Complexe Scolaire La Grâce',
      commune: 'Goma',
      type: 'private',
      status: 'active',
      subscriptionStatus: 'active',
      subscriptionPaidAt: new Date(),
      validatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      domain: 'grace.edugoma.cd',
      users: [
        { email: 'directeur.grace@edugoma.cd', firstName: 'Patrick', lastName: 'Bahati' },
        { email: 'secretaire.grace@edugoma.cd', firstName: 'Alphonsine', lastName: 'Muhindo' },
        { email: 'enseignant.grace@edugoma.cd', firstName: 'Emmanuel', lastName: 'Kambale' },
      ],
    },
    {
      name: 'Institut Bati Kivu',
      commune: 'Goma',
      type: 'private',
      status: 'active',
      subscriptionStatus: 'active',
      subscriptionPaidAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      validatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      domain: 'batikivu.edugoma.cd',
      users: [
        { email: 'directeur.batikivu@edugoma.cd', firstName: 'Jean-Claude', lastName: 'Mugisha' },
        { email: 'comptable.batikivu@edugoma.cd', firstName: 'Furaha', lastName: 'Ndayisaba' },
      ],
    },
    {
      name: 'École Primaire Katindo',
      commune: 'Goma',
      type: 'public',
      status: 'active',
      subscriptionStatus: 'trial',
      validatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      domain: 'katindo.edugoma.cd',
      users: [
        { email: 'directeur.katindo@edugoma.cd', firstName: 'Théophile', lastName: 'Rutayisire' },
        { email: 'enseignant.katindo@edugoma.cd', firstName: 'Esperance', lastName: 'Kavira' },
      ],
    },
    {
      name: 'Collège Amani Karisimbi',
      commune: 'Karisimbi',
      type: 'conventionned',
      status: 'pending',
      domain: 'amani.edugoma.cd',
      users: [],
    },
    {
      name: 'Complexe Scolaire Mugunga Excellence',
      commune: 'Mugunga',
      type: 'private',
      status: 'pending',
      domain: 'excellence.edugoma.cd',
      users: [],
    },
    {
      name: 'École Communautaire Nyiragongo',
      commune: 'Nyiragongo',
      type: 'community',
      status: 'pending',
      domain: 'nyiragongo.edugoma.cd',
      users: [],
    },
    {
      name: 'Lycée technique de Virunga',
      commune: 'Goma',
      type: 'public',
      status: 'active',
      subscriptionStatus: 'overdue',
      subscriptionPaidAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      validatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      domain: 'virunga.edugoma.cd',
      users: [{ email: 'directeur.virunga@edugoma.cd', firstName: 'Serge', lastName: 'Nsabimana' }],
    },
    {
      name: 'Institut La Source Mugunga',
      commune: 'Mugunga',
      type: 'private',
      status: 'suspended',
      subscriptionStatus: 'overdue',
      subscriptionPaidAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      validatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      domain: 'lasource.edugoma.cd',
      users: [
        { email: 'directeur.lasource@edugoma.cd', firstName: 'Clarisse', lastName: 'Mukamana' },
      ],
    },
    {
      name: 'École Primaire Kayembe',
      commune: 'Karisimbi',
      type: 'conventionned',
      status: 'active',
      subscriptionStatus: 'trial',
      validatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      domain: 'kayembe.edugoma.cd',
      users: [{ email: 'directeur.kayembe@edugoma.cd', firstName: 'Didier', lastName: 'Nzuzi' }],
    },
  ];

  let schoolsCreated = 0;
  for (const s of GOMA_SCHOOLS) {
    const school = await prisma.tenant.upsert({
      where: { name: s.name },
      update: {
        commune: s.commune,
        type: s.type,
        status: s.status,
        subscriptionStatus: s.subscriptionStatus ?? 'trial',
        subscriptionPaidAt: s.subscriptionPaidAt ?? null,
        validatedAt: s.validatedAt ?? null,
        domain: s.domain,
      },
      create: {
        name: s.name,
        commune: s.commune,
        type: s.type,
        status: s.status,
        subscriptionStatus: s.subscriptionStatus ?? 'trial',
        subscriptionPaidAt: s.subscriptionPaidAt ?? null,
        validatedAt: s.validatedAt ?? null,
        domain: s.domain,
        phone: `+243${Math.floor(Math.random() * 900000000 + 100000000)}`,
        email: s.domain,
      },
    });
    schoolsCreated++;

    // Users par école (idempotent par email)
    for (const u of s.users) {
      const user = await prisma.user.upsert({
        where: { email: u.email },
        update: { tenantId: school.id, isActive: true },
        create: {
          email: u.email,
          password: hashedPassword,
          firstName: u.firstName,
          lastName: u.lastName,
          tenantId: school.id,
          isActive: true,
        },
      });
      if (adminRole) {
        const link = await prisma.userRole.findFirst({
          where: { userId: user.id, roleId: adminRole.id },
        });
        if (!link) {
          await prisma.userRole.create({
            data: { userId: user.id, roleId: adminRole.id },
          });
        }
      }
    }
  }
  console.log(`✅ ${schoolsCreated} écoles Goma seedées (idempotent)`);

  // 7. Alertes priorité
  const alertCount = await prisma.alert.count();
  if (alertCount === 0) {
    const alertsData = [
      {
        type: 'SECURITY',
        severity: 'critical',
        title: 'Tentatives de brute force',
        message: '50 tentatives de connexion échouées depuis IP 192.168.1.45 en 10 minutes',
        source: 'Auth Guard',
      },
      {
        type: 'SYSTEM',
        severity: 'warning',
        title: 'Espace disque faible',
        message: 'Volume de stockage à 85% de capacité sur le noeud principal',
        source: 'Monitoring',
      },
      {
        type: 'BILLING',
        severity: 'info',
        title: 'Paiement en attente',
        message: '3 écoles ont des factures impayées depuis plus de 30 jours',
        source: 'Billing',
      },
      {
        type: 'USAGE',
        severity: 'warning',
        title: "Pic d'activité détecté",
        message: '320 connexions simultanées — 160% au-dessus de la normale',
        source: 'Analytics',
      },
      {
        type: 'SECURITY',
        severity: 'critical',
        title: 'Token refresh compromis',
        message: 'Refresh token réutilisé depuis 2 IPs différentes',
        source: 'Auth Guard',
      },
    ];

    for (const alert of alertsData) {
      await prisma.alert.create({
        data: {
          ...alert,
          tenantId: tenant.id,
        },
      });
    }
    console.log(`✅ ${alertsData.length} alertes créées`);
  } else {
    console.log(`⏭️  ${alertCount} alertes déjà présentes, skip`);
  }

  // 8. Tickets de support
  const ticketCount = await prisma.ticket.count();
  if (ticketCount === 0) {
    const ticketsData = [
      {
        title: 'Assistance intégration ERP École',
        description: "Demande d'assistance import élèves pour Collège Boboto (Kinshasa)",
        category: 'integration',
        status: 'open',
        priority: 'urgent',
        schoolName: 'Collège Boboto',
        schoolId: 'EDUG-KI-KIN-0001',
        requester: 'Aline Nshuti · Directrice',
      },
      {
        title: 'Paiement licence reçu',
        description: 'Renouvellement annuel 2024–2025 validé pour Lycée Shaumba',
        category: 'billing',
        status: 'resolved',
        priority: 'normal',
        schoolName: 'Lycée Shaumba',
        schoolId: 'EDUG-KI-KIN-0015',
        requester: 'Patrick Mumbere · Comptable',
      },
      {
        title: 'Erreur de connexion API',
        description: "L'API retourne 503 intermittant pour les écoles du Sud-Kivu",
        category: 'technical',
        status: 'in_progress',
        priority: 'urgent',
        schoolName: 'Institut Mwangaza',
        schoolId: 'EDUG-NK-GOM-0589',
        requester: 'Jean Kabongo · Admin',
      },
      {
        title: 'Formation utilisateurs',
        description: 'Demande de session de formation pour le personnel pedagogique',
        category: 'general',
        status: 'open',
        priority: 'low',
        schoolName: 'Collège Alfajiri',
        schoolId: 'EDUG-SK-BUK-0012',
        requester: 'Marie Nyirahabimana · Directrice',
      },
    ];

    for (const ticket of ticketsData) {
      await prisma.ticket.create({
        data: {
          ...ticket,
          tenantId: tenant.id,
        },
      });
    }
    console.log(`✅ ${ticketsData.length} tickets créés`);
  } else {
    console.log(`⏭️  ${ticketCount} tickets déjà présents, skip`);
  }

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
