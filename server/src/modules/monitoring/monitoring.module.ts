import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertService } from './alert.service';
import { MonitoringService } from './monitoring.service';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MonitoringService, AlertService],
  exports: [MonitoringService, AlertService],
})
export class MonitoringModule {}
