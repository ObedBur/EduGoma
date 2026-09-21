import { Controller, Get, Post, Patch, Param, Body, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TenantService } from './tenant.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { ValidateTenantDto, RejectTenantDto } from './dto/admin-actions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { CurrentUserId } from '../auth/decorators/user.decorator';

/**
 * ADMIN Tenant Controller
 * Endpoints for manual validation/rejection (requires super admin authentication)
 * Protected by JwtAuthGuard + SuperAdminGuard
 */
@Controller('admin/tenants')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminTenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Create a new school
   * POST /admin/tenants
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: RegisterTenantDto,
    @Req() req: Request,
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.create(dto, ip, userAgent, actorId);

    return {
      success: true,
      ...result,
    };
  }

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
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.validate(id, dto, ip, userAgent, actorId);

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
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.reject(id, dto, ip, userAgent, actorId);

    return {
      success: true,
      ...result,
    };
  }

  /**
   * Deactivate (suspend) a school
   * POST /admin/tenants/:id/deactivate
   */
  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(
    @Param('id') id: string,
    @Body() dto: { reason?: string },
    @Req() req: Request,
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.deactivate(id, actorId, ip, userAgent, dto.reason);

    return {
      success: true,
      ...result,
    };
  }

  /**
   * Reactivate a suspended school
   * POST /admin/tenants/:id/reactivate
   */
  @Post(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  async reactivate(
    @Param('id') id: string,
    @Req() req: Request,
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.reactivate(id, actorId, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }

  /**
   * Update a school
   * PATCH /admin/tenants/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<RegisterTenantDto>,
    @Req() req: Request,
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.update(id, dto, actorId, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }
}
