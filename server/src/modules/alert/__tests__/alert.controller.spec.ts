import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../auth/guards/super-admin.guard';
import { AlertController } from '../admin-alert.controller';
import { AlertService } from '../alert.service';

describe('AlertController', () => {
  let controller: AlertController;

  const mockAlertService = {
    getPriorityAlerts: jest.fn().mockResolvedValue([]),
    resolveAlert: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertController],
      providers: [
        { provide: AlertService, useValue: mockAlertService },
        { provide: PrismaService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn() })
      .overrideGuard(SuperAdminGuard)
      .useValue({ canActivate: jest.fn() })
      .compile();

    controller = module.get<AlertController>(AlertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /admin/alerts/priority', () => {
    it('should return success with data', async () => {
      const result = await controller.getPriorityAlerts({});
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('data');
    });

    it('should default to 10 limit', async () => {
      await controller.getPriorityAlerts({});
      expect(mockAlertService.getPriorityAlerts).toHaveBeenCalledWith(10);
    });

    it('should pass custom limit', async () => {
      await controller.getPriorityAlerts({ limit: 5 });
      expect(mockAlertService.getPriorityAlerts).toHaveBeenCalledWith(5);
    });
  });

  describe('PATCH /admin/alerts/:id/resolve', () => {
    it('should resolve alert', async () => {
      const result = await controller.resolveAlert('a1');
      expect(result).toHaveProperty('success', true);
      expect(mockAlertService.resolveAlert).toHaveBeenCalledWith('a1');
    });
  });

  describe('Guard enforcement', () => {
    it('should have JwtAuthGuard and SuperAdminGuard', () => {
      const guards = Reflect.getMetadata('__guards__', AlertController);
      expect(guards).toBeDefined();
      expect(guards.length).toBe(2);
    });
  });
});
