import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { HealthService } from './health.service';

@Controller('admin/system')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  async getSystemHealth() {
    const data = await this.healthService.getSystemHealth();
    return { success: true, data };
  }
}
