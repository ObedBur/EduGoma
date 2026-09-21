import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../auth/guards/super-admin.guard';
import { TicketController } from '../admin-ticket.controller';
import { TicketService } from '../ticket.service';

describe('TicketController', () => {
  let controller: TicketController;

  const mockTicketService = {
    getTickets: jest.fn().mockResolvedValue([]),
    getTicketStats: jest.fn().mockResolvedValue({ total: 0, open: 0, inProgress: 0, urgent: 0 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        { provide: TicketService, useValue: mockTicketService },
        { provide: PrismaService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn() })
      .overrideGuard(SuperAdminGuard)
      .useValue({ canActivate: jest.fn() })
      .compile();

    controller = module.get<TicketController>(TicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /admin/support/tickets', () => {
    it('should return success with data', async () => {
      const result = await controller.getTickets({});
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('data');
    });

    it('should pass filters to service', async () => {
      await controller.getTickets({ status: 'open', priority: 'urgent', limit: 5 });
      expect(mockTicketService.getTickets).toHaveBeenCalledWith('open', 'urgent', 5);
    });

    it('should default limit to 10', async () => {
      await controller.getTickets({});
      expect(mockTicketService.getTickets).toHaveBeenCalledWith(undefined, undefined, 10);
    });
  });

  describe('GET /admin/support/tickets/stats', () => {
    it('should return stats', async () => {
      const result = await controller.getTicketStats();
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
    });
  });

  describe('Guard enforcement', () => {
    it('should have JwtAuthGuard and SuperAdminGuard', () => {
      const guards = Reflect.getMetadata('__guards__', TicketController);
      expect(guards).toBeDefined();
      expect(guards.length).toBe(2);
    });
  });
});
