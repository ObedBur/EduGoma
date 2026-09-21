import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../modules/auth/guards/super-admin.guard';
import { StatsService } from './stats.service';
import { GrowthQueryDto, ActivityLogQueryDto } from './dto/stats-query.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('stats/summary')
  async getSummary() {
    const data = await this.statsService.getSummary();
    return { success: true, data };
  }

  @Get('stats/growth')
  async getGrowth(@Query() query: GrowthQueryDto) {
    const data = await this.statsService.getGrowth(query.months ?? 6);
    return { success: true, data };
  }

  @Get('stats/metrics')
  async getMetrics() {
    const data = await this.statsService.getMetrics();
    return { success: true, data };
  }

  @Get('activity-log')
  async getActivityLog(@Query() query: ActivityLogQueryDto) {
    const limit = query.limit ?? 5;
    const data = await this.statsService.getActivityLog(limit);
    return { success: true, count: data.length, data };
  }
}
