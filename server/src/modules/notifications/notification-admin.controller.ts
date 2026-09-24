import { Controller, Get, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/notifications')
@UseGuards(JwtAuthGuard, AdminGuard)
export class NotificationAdminController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /admin/notifications/logs?tenantId=&limit=
   */
  @Get('logs')
  async getLogs(
    @Query('tenantId') tenantId?: string,
    @Query('limit') limit?: string,
  ) {
    const take = Math.min(Number(limit) || 50, 200);

    const logs = await this.prisma.notificationLog.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { sentAt: 'desc' },
      take,
      include: {
        tenant: { select: { id: true, name: true, phone: true } },
      },
    });

    return logs;
  }
}
