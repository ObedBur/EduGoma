import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async getTickets(status?: string, priority?: string, limit = 10) {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    return this.prisma.ticket.findMany({
      where,
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        priority: true,
        schoolName: true,
        schoolId: true,
        requester: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getTicketStats() {
    const [total, open, inProgress, urgent] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: 'open' } }),
      this.prisma.ticket.count({ where: { status: 'in_progress' } }),
      this.prisma.ticket.count({ where: { priority: 'urgent' } }),
    ]);

    return { total, open, inProgress, urgent };
  }
}
