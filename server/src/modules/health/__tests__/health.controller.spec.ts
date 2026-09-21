import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../auth/guards/super-admin.guard';
import { HealthController } from '../admin-health.controller';
import { HealthService } from '../health.service';

describe('HealthController', () => {
  let controller: HealthController;

  const mockHealthService = {
    getSystemHealth: jest.fn().mockResolvedValue({
      status: 'healthy',
      uptime: '2h 30m',
      timestamp: new Date().toISOString(),
      database: { status: 'connected', latencyMs: 5 },
      memory: { heapUsedMB: 50, heapTotalMB: 100, usagePercent: 50 },
      stats: { totalTenants: 5, totalUsers: 20 },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthService, useValue: mockHealthService },
        { provide: PrismaService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn() })
      .overrideGuard(SuperAdminGuard)
      .useValue({ canActivate: jest.fn() })
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /admin/system/health', () => {
    it('should return success with health data', async () => {
      const result = await controller.getSystemHealth();
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('status', 'healthy');
    });
  });

  describe('Guard enforcement', () => {
    it('should have JwtAuthGuard and SuperAdminGuard', () => {
      const guards = Reflect.getMetadata('__guards__', HealthController);
      expect(guards).toBeDefined();
      expect(guards.length).toBe(2);
    });
  });
});
