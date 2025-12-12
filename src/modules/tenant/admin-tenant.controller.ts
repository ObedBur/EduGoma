import { Controller, Get, Post, Param, Body, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TenantService } from './tenant.service';
import { ValidateTenantDto, RejectTenantDto } from './dto/admin-actions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

/**
 * ADMIN Tenant Controller
 * Endpoints for manual validation/rejection (requires admin authentication)
 * Protected by JwtAuthGuard + AdminGuard
 */
@Controller('admin/tenants')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminTenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Get all pending schools
   * GET /admin/tenants/pending
   */
  @Get('pending')
  @HttpCode(HttpStatus.OK)
  async getPending() {
    const tenants = await this.tenantService.getPending();

    return {
      success: true,
      count: tenants.length,
      data: tenants,
    };
  }

  /**
   * Get all active schools
   * GET /admin/tenants/active
   */
  @Get('active')
  @HttpCode(HttpStatus.OK)
  async getActive() {
    const tenants = await this.tenantService.getActive();

    return {
      success: true,
      count: tenants.length,
      data: tenants,
    };
  }

  /**
   * Validate (approve) a school
   * POST /admin/tenants/:id/validate
   */
  @Post(':id/validate')
  @HttpCode(HttpStatus.OK)
  async validate(
    @Param('id') id: string,
    @Body() dto: ValidateTenantDto,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.validate(id, dto, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }

  /**
   * Reject a school
   * POST /admin/tenants/:id/reject
   */
  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectTenantDto,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.reject(id, dto, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }
}
