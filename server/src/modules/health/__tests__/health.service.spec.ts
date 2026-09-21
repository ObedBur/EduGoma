import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '../health.service';
import { PrismaService } from '../../../core/prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: {
    $queryRaw: jest.Mock;
    tenant: { count: jest.Mock };
    user: { count: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      tenant: { count: jest.fn().mockResolvedValue(5) },
      user: { count: jest.fn().mockResolvedValue(20) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSystemHealth', () => {
    it('should return healthy status when DB is up', async () => {
      const result = await service.getSystemHealth();
      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('timestamp');
    });

    it('should include database info', async () => {
      const result = await service.getSystemHealth();
      expect(result.database).toHaveProperty('status', 'connected');
      expect(result.database).toHaveProperty('latencyMs');
      expect(result.database.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it('should include memory info', async () => {
      const result = await service.getSystemHealth();
      expect(result.memory).toHaveProperty('heapUsedMB');
      expect(result.memory).toHaveProperty('heapTotalMB');
      expect(result.memory).toHaveProperty('usagePercent');
      expect(result.memory.heapUsedMB).toBeGreaterThan(0);
    });

    it('should include stats', async () => {
      const result = await service.getSystemHealth();
      expect(result.stats).toHaveProperty('totalTenants', 5);
      expect(result.stats).toHaveProperty('totalUsers', 20);
    });

    it('should return degraded when DB is down', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('Connection refused'));
      const result = await service.getSystemHealth();
      expect(result).toHaveProperty('status', 'degraded');
      expect(result.database).toHaveProperty('status', 'error');
    });

    it('should format uptime correctly', async () => {
      const result = await service.getSystemHealth();
      expect(typeof result.uptime).toBe('string');
      expect(result.uptime.length).toBeGreaterThan(0);
    });
  });
});
