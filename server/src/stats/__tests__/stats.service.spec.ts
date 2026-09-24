import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../core/prisma/prisma.service';
import { StatsService } from '../stats.service';

describe('StatsService', () => {
  let service: StatsService;
  let prisma: {
    tenant: {
      count: jest.Mock;
      findMany: jest.Mock;
    };
    user: {
      count: jest.Mock;
    };
    demoRequest: {
      count: jest.Mock;
      findMany: jest.Mock;
    };
    accessLog: {
      findMany: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      tenant: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        count: jest.fn(),
      },
      demoRequest: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      accessLog: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return summary stats with correct structure', async () => {
      // getTenantCounts order: all, active, pending, suspended, trial, overdue
      // then getSummary: currentMonth, previousMonth
      prisma.tenant.count
        .mockResolvedValueOnce(10) // all (counts)
        .mockResolvedValueOnce(5) // active (counts)
        .mockResolvedValueOnce(2) // pending
        .mockResolvedValueOnce(1) // suspended
        .mockResolvedValueOnce(3) // trial
        .mockResolvedValueOnce(1) // overdue
        .mockResolvedValueOnce(2) // current month schools
        .mockResolvedValueOnce(1); // previous month schools

      prisma.tenant.findMany.mockResolvedValue([{ commune: 'Goma' }, { commune: 'Karisimbi' }]);

      prisma.demoRequest.count
        .mockResolvedValueOnce(3) // pending dossiers
        .mockResolvedValueOnce(1) // urgent dossiers
        .mockResolvedValueOnce(0) // current month students (converted)
        .mockResolvedValueOnce(0); // previous month students (converted)

      prisma.user.count
        .mockResolvedValueOnce(20) // total users
        .mockResolvedValueOnce(5) // current month users
        .mockResolvedValueOnce(3) // previous month users
        .mockResolvedValueOnce(2); // active today users

      const result = await service.getSummary();

      expect(result).toHaveProperty('counts');
      expect(result).toHaveProperty('schools');
      expect(result).toHaveProperty('pendingDossiers');
      expect(result).toHaveProperty('users');
      expect(result).toHaveProperty('students');

      expect(result.counts).toEqual({
        all: 10,
        active: 5,
        pending: 2,
        suspended: 1,
        trial: 3,
        overdue: 1,
      });

      expect(result.schools).toEqual({
        active: 5,
        total: 10,
        trend: '+1',
        activityRate: 50,
        provinces: 2,
      });

      expect(result.pendingDossiers).toEqual({
        count: 3,
        urgent: 1,
        avgValidationHours: null,
      });

      expect(result.users.total).toBe(20);
      expect(result.users.activeToday).toBe(2);
    });

    it('should calculate activity rate correctly', async () => {
      prisma.tenant.count
        .mockResolvedValueOnce(10) // all
        .mockResolvedValueOnce(8) // active
        .mockResolvedValueOnce(0) // pending
        .mockResolvedValueOnce(0) // suspended
        .mockResolvedValueOnce(0) // trial
        .mockResolvedValueOnce(0) // overdue
        .mockResolvedValueOnce(0) // current month
        .mockResolvedValueOnce(0); // previous month

      prisma.tenant.findMany.mockResolvedValue([]);
      prisma.demoRequest.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      prisma.user.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.getSummary();

      expect(result.schools.activityRate).toBe(80);
    });

    it('should handle zero total schools', async () => {
      prisma.tenant.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      prisma.tenant.findMany.mockResolvedValue([]);
      prisma.demoRequest.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      prisma.user.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.getSummary();

      expect(result.schools.activityRate).toBe(0);
    });

    it('should calculate school trend correctly', async () => {
      prisma.tenant.count
        .mockResolvedValueOnce(10) // all
        .mockResolvedValueOnce(5) // active
        .mockResolvedValueOnce(0) // pending
        .mockResolvedValueOnce(0) // suspended
        .mockResolvedValueOnce(0) // trial
        .mockResolvedValueOnce(0) // overdue
        .mockResolvedValueOnce(3) // current month
        .mockResolvedValueOnce(1); // previous month

      prisma.tenant.findMany.mockResolvedValue([]);
      prisma.demoRequest.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      prisma.user.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.getSummary();

      expect(result.schools.trend).toBe('+2');
    });
  });

  describe('getGrowth', () => {
    it('should return growth data with correct structure', async () => {
      prisma.tenant.findMany.mockResolvedValue([]);
      prisma.demoRequest.findMany.mockResolvedValue([]);

      const result = await service.getGrowth(3);

      expect(result).toHaveProperty('months');
      expect(result).toHaveProperty('schools');
      expect(result).toHaveProperty('students');
      expect(result).toHaveProperty('targets');
      expect(result.targets).toEqual({ schools: 200, students: null });
    });

    it('should return correct number of months', async () => {
      prisma.tenant.findMany.mockResolvedValue([]);
      prisma.demoRequest.findMany.mockResolvedValue([]);

      const result = await service.getGrowth(6);

      expect(result.months).toHaveLength(6);
      expect(result.schools).toHaveLength(6);
      expect(result.students).toHaveLength(6);
    });

    it('should default to 6 months', async () => {
      prisma.tenant.findMany.mockResolvedValue([]);
      prisma.demoRequest.findMany.mockResolvedValue([]);

      const result = await service.getGrowth();

      expect(result.months).toHaveLength(6);
    });

    it('should filter tenants to active schools only', async () => {
      prisma.tenant.findMany.mockResolvedValue([]);
      prisma.demoRequest.findMany.mockResolvedValue([]);

      await service.getGrowth(6);

      expect(prisma.tenant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'active' }),
        }),
      );
    });

    it('should return cumulative school counts', async () => {
      const now = new Date();
      const month1 = new Date(now.getFullYear(), now.getMonth() - 2, 15);
      const month2 = new Date(now.getFullYear(), now.getMonth() - 1, 10);
      const month3 = new Date(now.getFullYear(), now.getMonth(), 5);

      prisma.tenant.findMany.mockResolvedValue([
        { createdAt: month1 },
        { createdAt: month2 },
        { createdAt: month2 },
        { createdAt: month3 },
        { createdAt: month3 },
        { createdAt: month3 },
        { createdAt: month3 },
        { createdAt: month3 },
        { createdAt: month3 },
        { createdAt: month3 },
      ]);
      prisma.demoRequest.findMany.mockResolvedValue([]);

      const result = await service.getGrowth(3);

      expect(result.schools[0]).toBe(1);
      expect(result.schools[1]).toBe(3);
      expect(result.schools[2]).toBe(10);
    });

    it('should return cumulative student counts', async () => {
      const now = new Date();
      const month1 = new Date(now.getFullYear(), now.getMonth() - 2, 15);
      const month2 = new Date(now.getFullYear(), now.getMonth() - 1, 10);

      prisma.tenant.findMany.mockResolvedValue([]);
      prisma.demoRequest.findMany.mockResolvedValue([
        { updatedAt: month1 },
        { updatedAt: month1 },
        { updatedAt: month1 },
        { updatedAt: month1 },
        { updatedAt: month1 },
        { updatedAt: month2 },
        { updatedAt: month2 },
      ]);

      const result = await service.getGrowth(3);

      expect(result.students[0]).toBe(5);
      expect(result.students[1]).toBe(7);
    });
  });

  describe('getMetrics', () => {
    it('should return metrics with correct structure', async () => {
      prisma.tenant.findMany
        .mockResolvedValueOnce([]) // current month tenants
        .mockResolvedValueOnce([]); // previous month tenants
      prisma.demoRequest.count
        .mockResolvedValueOnce(10) // total demo requests
        .mockResolvedValueOnce(8); // converted requests
      prisma.accessLog.count.mockResolvedValue(300000);

      const result = await service.getMetrics();

      expect(result).toHaveProperty('onboarding');
      expect(result).toHaveProperty('completionRate');
      expect(result).toHaveProperty('storage');
      expect(result.onboarding).toHaveProperty('avgHours');
      expect(result.onboarding).toHaveProperty('trend');
      expect(result.onboarding).toHaveProperty('trendLabel');
      expect(result.completionRate).toHaveProperty('rate');
      expect(result.completionRate).toHaveProperty('note');
      expect(result.storage).toHaveProperty('usedGB');
    });

    it('should calculate avgHours from validated tenants', async () => {
      const now = new Date();
      const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

      prisma.tenant.findMany
        .mockResolvedValueOnce([
          { createdAt: hoursAgo(48), validatedAt: hoursAgo(12) }, // 36h
          { createdAt: hoursAgo(72), validatedAt: hoursAgo(24) }, // 48h
        ])
        .mockResolvedValueOnce([]); // previous month
      prisma.demoRequest.count.mockResolvedValue(0);
      prisma.accessLog.count.mockResolvedValue(0);

      const result = await service.getMetrics();

      expect(result.onboarding.avgHours).toBe(42);
    });

    it('should return null avgHours when no validated tenants', async () => {
      prisma.tenant.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      prisma.demoRequest.count.mockResolvedValue(0);
      prisma.accessLog.count.mockResolvedValue(0);

      const result = await service.getMetrics();

      expect(result.onboarding.avgHours).toBeNull();
    });

    it('should calculate completion rate from demo requests', async () => {
      prisma.tenant.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      prisma.demoRequest.count
        .mockResolvedValueOnce(20) // total
        .mockResolvedValueOnce(15); // converted
      prisma.accessLog.count.mockResolvedValue(0);

      const result = await service.getMetrics();

      expect(result.completionRate.rate).toBe(75);
    });

    it('should calculate dynamic trend from current vs previous month', async () => {
      const now = new Date();
      const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

      prisma.tenant.findMany
        .mockResolvedValueOnce([
          { createdAt: hoursAgo(24), validatedAt: hoursAgo(12) }, // current month: 12h avg
        ])
        .mockResolvedValueOnce([
          { createdAt: hoursAgo(72), validatedAt: hoursAgo(24) }, // prev month: 48h avg
        ]);
      prisma.demoRequest.count.mockResolvedValue(0);
      prisma.accessLog.count.mockResolvedValue(0);

      const result = await service.getMetrics();

      // (12 - 48) / 48 * 100 = -75
      expect(result.onboarding.trend).toBe(-75);
    });

    it('should return null trend when no previous month tenants', async () => {
      prisma.tenant.findMany
        .mockResolvedValueOnce([
          { createdAt: new Date(Date.now() - 3600000), validatedAt: new Date() },
        ])
        .mockResolvedValueOnce([]);
      prisma.demoRequest.count.mockResolvedValue(0);
      prisma.accessLog.count.mockResolvedValue(0);

      const result = await service.getMetrics();

      expect(result.onboarding.trend).toBeNull();
    });

    it('should estimate storage from accessLog count', async () => {
      prisma.tenant.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      prisma.demoRequest.count.mockResolvedValue(0);
      prisma.accessLog.count.mockResolvedValue(307200); // 300KB * 1024 = 307200

      const result = await service.getMetrics();

      expect(result.storage.usedGB).toBeGreaterThan(0);
    });

    it('should handle DB errors gracefully', async () => {
      prisma.tenant.findMany.mockRejectedValue(new Error('Connection refused'));

      await expect(service.getMetrics()).rejects.toThrow('Connection refused');
    });
  });

  describe('getActivityLog', () => {
    it('should return activity log with correct structure', async () => {
      prisma.accessLog.findMany.mockResolvedValue([
        {
          action: 'TENANT_APPROVED',
          resourceType: 'TENANT',
          createdAt: new Date(),
          metadata: null,
          user: { firstName: 'Admin', lastName: 'EduGoma', email: 'admin@edugoma.cd' },
          tenant: { name: 'Institut Technique de Goma' },
        },
      ]);

      const result = await service.getActivityLog(5);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('school');
      expect(result[0]).toHaveProperty('text');
      expect(result[0]).toHaveProperty('time');
    });

    it('should map actions to labels correctly', async () => {
      prisma.accessLog.findMany.mockResolvedValue([
        {
          action: 'TENANT_APPROVED',
          resourceType: 'TENANT',
          createdAt: new Date(),
          metadata: null,
          user: { firstName: 'Admin', lastName: 'EduGoma', email: 'admin@edugoma.cd' },
          tenant: { name: 'École Test' },
        },
      ]);

      const result = await service.getActivityLog(1);

      expect(result[0].type).toBe('ACCESS_GRANTED');
      expect(result[0].title).toBe('Accès école activé');
      expect(result[0].school).toBe('École Test');
    });

    it('should handle empty activity log', async () => {
      prisma.accessLog.findMany.mockResolvedValue([]);

      const result = await service.getActivityLog(5);

      expect(result).toHaveLength(0);
    });

    it('should handle DB errors gracefully', async () => {
      prisma.accessLog.findMany.mockRejectedValue(new Error('Query timeout'));

      await expect(service.getActivityLog(5)).rejects.toThrow('Query timeout');
    });

    it('should handle null metadata gracefully', async () => {
      prisma.accessLog.findMany.mockResolvedValue([
        {
          action: 'DEMO_REQUEST',
          resourceType: 'DEMO',
          createdAt: new Date(),
          metadata: null,
          user: { firstName: 'Jean', lastName: 'Dupont', email: 'jean@test.cd' },
          tenant: null,
        },
      ]);

      const result = await service.getActivityLog(1);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('DEMO_REQUEST');
    });
  });
});
