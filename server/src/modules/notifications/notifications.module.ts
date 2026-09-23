import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationAdminController } from './notification-admin.controller';
import { TenantModule } from '../tenant/tenant.module';
import { AlertModule } from '../alert/alert.module';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot(), TenantModule, AlertModule],
  controllers: [NotificationAdminController],
  providers: [NotificationSchedulerService, PrismaService],
})
export class NotificationsModule {}
