import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(private prisma: PrismaService) {}

  async getPriorityAlerts(limit = 10) {
    return this.prisma.alert.findMany({
      where: { resolved: false },
      orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      select: {
        id: true,
        type: true,
        severity: true,
        title: true,
        message: true,
        source: true,
        createdAt: true,
      },
    });
  }

  async resolveAlert(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { resolved: true },
    });
  }

  async createAlert(data: {
    tenantId?: string;
    type: string;
    severity?: string;
    title: string;
    message: string;
    source?: string;
  }) {
    return this.prisma.alert.create({
      data: {
        tenantId: data.tenantId,
        type: data.type,
        severity: data.severity ?? 'warning',
        title: data.title,
        message: data.message,
        source: data.source ?? 'notifications',
      },
    });
  }
}
