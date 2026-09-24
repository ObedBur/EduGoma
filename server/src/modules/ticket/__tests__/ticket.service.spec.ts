import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { TicketService } from '../ticket.service';

describe('TicketService', () => {
  let service: TicketService;
  let prisma: {
    ticket: {
      findMany: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      ticket: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTickets', () => {
    it('should return tickets with correct structure', async () => {
      prisma.ticket.findMany.mockResolvedValue([
        {
          id: 't1',
          title: 'Import élèves',
          description: 'Aide import',
          category: 'integration',
          status: 'open',
          priority: 'urgent',
          schoolName: 'Collège Boboto',
          schoolId: 'EDU-001',
          requester: 'Aline',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.getTickets();
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 't1');
    });

    it('should filter by status', async () => {
      prisma.ticket.findMany.mockResolvedValue([]);
      await service.getTickets('open');
      expect(prisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'open' } }),
      );
    });

    it('should filter by priority', async () => {
      prisma.ticket.findMany.mockResolvedValue([]);
      await service.getTickets(undefined, 'urgent');
      expect(prisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { priority: 'urgent' } }),
      );
    });

    it('should respect limit', async () => {
      prisma.ticket.findMany.mockResolvedValue([]);
      await service.getTickets(undefined, undefined, 5);
      expect(prisma.ticket.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }));
    });

    it('should handle empty tickets', async () => {
      prisma.ticket.findMany.mockResolvedValue([]);
      const result = await service.getTickets();
      expect(result).toHaveLength(0);
    });
  });

  describe('getTicketStats', () => {
    it('should return ticket statistics', async () => {
      prisma.ticket.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(4) // open
        .mockResolvedValueOnce(3) // in_progress
        .mockResolvedValueOnce(2); // urgent

      const result = await service.getTicketStats();
      expect(result).toEqual({ total: 10, open: 4, inProgress: 3, urgent: 2 });
    });
  });
});
