import { PrismaService } from '../core/prisma/prisma.service';

export interface TenantCounts {
  all: number;
  active: number;
  pending: number;
  suspended: number;
  trial: number;
  overdue: number;
}

export async function getTenantCounts(prisma: PrismaService): Promise<TenantCounts> {
  const overdueCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [all, active, pending, suspended, trial, overdue] = await Promise.all([
    prisma.tenant.count(),
    prisma.tenant.count({ where: { status: 'active' } }),
    prisma.tenant.count({ where: { status: 'pending' } }),
    prisma.tenant.count({ where: { status: 'suspended' } }),
    prisma.tenant.count({
      where: {
        status: { notIn: ['suspended', 'rejected'] },
        subscriptionStatus: { not: 'overdue' },
        subscriptionPaidAt: null,
      },
    }),
    prisma.tenant.count({
      where: {
        status: { notIn: ['suspended', 'rejected'] },
        OR: [
          { subscriptionStatus: 'overdue' },
          {
            AND: [
              { subscriptionPaidAt: { not: null } },
              { subscriptionPaidAt: { lt: overdueCutoff } },
            ],
          },
        ],
      },
    }),
  ]);

  return { all, active, pending, suspended, trial, overdue };
}
