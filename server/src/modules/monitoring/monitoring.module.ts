import { Module, Global } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitoringService } from './monitoring.service';
import { AlertService } from './alert.service';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MonitoringService, AlertService],
  exports: [MonitoringService, AlertService],
})
export class MonitoringModule {}