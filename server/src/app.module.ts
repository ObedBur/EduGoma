import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { AccessLogModule } from './modules/access-log/accesslog.module';
import { DemoRequestModule } from './modules/demo-request/demo-request.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { AlertModule } from './modules/alert/alert.module';
import { HealthModule } from './modules/health/health.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TenantMiddleware } from './common/middlewares/tenant.middleware';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10, // Global limit, can be overridden by @Throttle()
    }]),
    PrismaModule,
    AuthModule,
    UserModule,
    TenantModule,
    RbacModule,
    AccessLogModule,
    DemoRequestModule,
    MonitoringModule,
    StatsModule,
    AlertModule,
    HealthModule,
    TicketModule,
    NotificationsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, TenantMiddleware)
      .forRoutes('*'); // global
  }
}
