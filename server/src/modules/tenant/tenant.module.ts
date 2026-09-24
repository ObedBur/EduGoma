import { Module } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AdminTenantController } from './admin-tenant.controller';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { WhatsAppService } from './services/whatsapp.service';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [AuthModule],
  controllers: [TenantController, AdminTenantController],
  providers: [TenantService, SmsService, EmailService, WhatsAppService, PrismaService],
  exports: [TenantService, EmailService, WhatsAppService],
})
export class TenantModule {}
