import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AdminDemoRequestController } from './admin-demo-request.controller';
import { DemoRequestController } from './demo-request.controller';
import { DemoRequestService } from './demo-request.service';

@Module({
  imports: [PrismaModule],
  controllers: [DemoRequestController, AdminDemoRequestController],
  providers: [DemoRequestService],
  exports: [DemoRequestService],
})
export class DemoRequestModule {}
