import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { AlertService } from '../alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let prisma: {
    alert: {
      findMany: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      alert: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AlertService>(AlertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPriorityAlerts', () => {
    it('should return unresolved alerts', async () => {
      prisma.alert.findMany.mockResolvedValue([
        {
          id: 'a1',
          type: 'SECURITY',
          severity: 'critical',
          title: 'Brute force',
          message: '50 tentatives',
          source: 'Auth',
          createdAt: new Date(),
        },
      ]);

      const result = await service.getPriorityAlerts(10);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 'a1');
      expect(prisma.alert.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { resolved: false } }),
      );
    });

    it('should respect limit param', async () => {
      prisma.alert.findMany.mockResolvedValue([]);
      await service.getPriorityAlerts(5);
      expect(prisma.alert.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }));
    });

    it('should handle empty alerts', async () => {
      prisma.alert.findMany.mockResolvedValue([]);
      const result = await service.getPriorityAlerts();
      expect(result).toHaveLength(0);
    });
  });

  describe('resolveAlert', () => {
    it('should mark alert as resolved', async () => {
      prisma.alert.update.mockResolvedValue({ id: 'a1', resolved: true });
      const result = await service.resolveAlert('a1');
      expect(result).toHaveProperty('resolved', true);
      expect(prisma.alert.update).toHaveBeenCalledWith({
        where: { id: 'a1' },
        data: { resolved: true },
      });
    });
  });
});
