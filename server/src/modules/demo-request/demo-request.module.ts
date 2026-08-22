import { Module } from '@nestjs/common';
import { DemoRequestController } from './demo-request.controller';
import { AdminDemoRequestController } from './admin-demo-request.controller';
import { DemoRequestService } from './demo-request.service';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DemoRequestController, AdminDemoRequestController],
  providers: [DemoRequestService],
  exports: [DemoRequestService],
})
export class DemoRequestModule {}
