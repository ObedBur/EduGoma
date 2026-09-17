import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { AdminTenantController } from './admin-tenant.controller';
import { SmsService } from './services/sms.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TenantController, AdminTenantController],
  providers: [TenantService, SmsService, PrismaService],
  exports: [TenantService],
})
export class TenantModule {}
