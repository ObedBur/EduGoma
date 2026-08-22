import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DemoRequestService } from './demo-request.service';
import { UpdateDemoRequestStatusDto } from './dto/update-demo-request-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

/**
 * ADMIN Demo Request Controller
 * Protected by JwtAuthGuard + AdminGuard
 */
@Controller('admin/demo-requests')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminDemoRequestController {
  constructor(private readonly demoRequestService: DemoRequestService) {}

  /**
   * GET /admin/demo-requests
   * Liste toutes les demandes (triées par date de création, plus récentes d'abord)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const requests = await this.demoRequestService.findAll();
    return {
      success: true,
      count: requests.length,
      data: requests,
    };
  }

  /**
   * GET /admin/demo-requests/:id
   * Récupère les détails d'une demande spécifique
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const request = await this.demoRequestService.findOne(id);
    return {
      success: true,
      data: request,
    };
  }

  /**
   * PATCH /admin/demo-requests/:id/status
   * Met à jour le statut d'une demande (avec respect du workflow)
   */
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDemoRequestStatusDto,
  ) {
    const request = await this.demoRequestService.updateStatus(id, dto);
    return {
      success: true,
      message: `Le statut de la demande a été mis à jour avec succès.`,
      data: request,
    };
  }
}
