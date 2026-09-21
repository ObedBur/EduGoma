import { Module } from '@nestjs/common';
import { AlertController } from './admin-alert.controller';
import { AlertService } from './alert.service';

@Module({
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
