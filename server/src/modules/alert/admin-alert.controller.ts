import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { AlertService } from './alert.service';
import { AlertQueryDto } from './dto/alert-query.dto';

@Controller('admin/alerts')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get('priority')
  async getPriorityAlerts(@Query() query: AlertQueryDto) {
    const limit = query.limit ?? 10;
    const data = await this.alertService.getPriorityAlerts(limit);
    return { success: true, count: data.length, data };
  }

  @Patch(':id/resolve')
  async resolveAlert(@Param('id') id: string) {
    await this.alertService.resolveAlert(id);
    return { success: true };
  }
}
