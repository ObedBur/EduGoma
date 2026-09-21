import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../modules/auth/guards/super-admin.guard';
import { TokenService } from '../../modules/auth/services/token.service';
import { StatsController } from '../stats.controller';
import { StatsService } from '../stats.service';

describe('StatsController — Guards', () => {
  let controller: StatsController;

  const mockStatsService = {
    getSummary: jest.fn().mockResolvedValue({}),
    getGrowth: jest.fn().mockResolvedValue({}),
    getMetrics: jest.fn().mockResolvedValue({}),
    getActivityLog: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        { provide: StatsService, useValue: mockStatsService },
        { provide: PrismaService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn() })
      .overrideGuard(SuperAdminGuard)
      .useValue({ canActivate: jest.fn() })
      .compile();

    controller = module.get<StatsController>(StatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /admin/stats/summary', () => {
    it('should return success with data', async () => {
      const result = await controller.getSummary();
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
    });
  });

  describe('GET /admin/stats/growth', () => {
    it('should return success with data', async () => {
      const result = await controller.getGrowth({ months: 6 });
      expect(result).toHaveProperty('success', true);
      expect(mockStatsService.getGrowth).toHaveBeenCalledWith(6);
    });

    it('should default to 6 months when no query', async () => {
      const result = await controller.getGrowth({});
      expect(mockStatsService.getGrowth).toHaveBeenCalledWith(6);
    });

    it('should pass custom months', async () => {
      await controller.getGrowth({ months: 12 });
      expect(mockStatsService.getGrowth).toHaveBeenCalledWith(12);
    });
  });

  describe('GET /admin/stats/metrics', () => {
    it('should return success with data', async () => {
      const result = await controller.getMetrics();
      expect(result).toHaveProperty('success', true);
    });
  });

  describe('GET /admin/activity-log', () => {
    it('should return success with count', async () => {
      const result = await controller.getActivityLog({ limit: 5 });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('count');
    });

    it('should default to limit 5 when no query', async () => {
      await controller.getActivityLog({});
      expect(mockStatsService.getActivityLog).toHaveBeenCalledWith(5);
    });
  });

  describe('Guard enforcement', () => {
    it('should have JwtAuthGuard and SuperAdminGuard on class', () => {
      const guards = Reflect.getMetadata('__guards__', StatsController);
      expect(guards).toBeDefined();
      expect(guards.length).toBe(2);
    });

    it('JwtAuthGuard should throw UnauthorizedException when no token', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          JwtAuthGuard,
          { provide: TokenService, useValue: {} },
          { provide: AuthService, useValue: {} },
          { provide: Reflector, useValue: { getAllAndOverride: () => false } },
        ],
      }).compile();

      const guard = module.get<JwtAuthGuard>(JwtAuthGuard);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: undefined },
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('SuperAdminGuard should throw ForbiddenException when user has no Super Admin role', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SuperAdminGuard,
          {
            provide: PrismaService,
            useValue: {
              user: {
                findUnique: jest.fn().mockResolvedValue({
                  id: 'user-1',
                  userRoles: [{ role: { name: 'Admin', level: 2 } }],
                }),
              },
            },
          },
        ],
      }).compile();

      const guard = module.get<SuperAdminGuard>(SuperAdminGuard);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { id: 'user-1' },
          }),
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });
  });
});
