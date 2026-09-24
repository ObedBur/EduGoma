import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AlertModule } from '../alert/alert.module';
import { TenantModule } from '../tenant/tenant.module';
import { NotificationAdminController } from './notification-admin.controller';
import { NotificationSchedulerService } from './notification-scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), TenantModule, AlertModule],
  controllers: [NotificationAdminController],
  providers: [NotificationSchedulerService, PrismaService],
})
export class NotificationsModule {}
