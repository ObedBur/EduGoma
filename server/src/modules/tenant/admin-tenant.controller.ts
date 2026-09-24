import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUserId } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { RejectTenantDto, ValidateTenantDto } from './dto/admin-actions.dto';
import { ListPageQueryDto, ListTenantsQueryDto } from './dto/list-tenants.query';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { TenantService } from './tenant.service';

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
   * Paginated list (sort / filters / search)
   * GET /admin/tenants?page=&limit=&sort=&order=&search=&status=&commune=&type=&subscription=
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query() query: ListTenantsQueryDto) {
    const result = await this.tenantService.listTenants(query);

    return {
      success: true,
      count: result.meta.total,
      data: result,
    };
  }

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
   * Get pending schools (paginated)
   * GET /admin/tenants/pending?page=&limit=
   */
  @Get('pending')
  @HttpCode(HttpStatus.OK)
  async getPending(@Query() query: ListPageQueryDto) {
    const result = await this.tenantService.listTenants({
      ...query,
      status: 'pending',
      sort: 'createdAt',
      order: 'desc',
    });

    return {
      success: true,
      count: result.meta.total,
      data: result.items,
      meta: result.meta,
    };
  }

  /**
   * Get active schools (paginated)
   * GET /admin/tenants/active?page=&limit=
   */
  @Get('active')
  @HttpCode(HttpStatus.OK)
  async getActive(@Query() query: ListPageQueryDto) {
    const result = await this.tenantService.listTenants({
      ...query,
      status: 'active',
      sort: 'validatedAt',
      order: 'desc',
    });

    return {
      success: true,
      count: result.meta.total,
      data: result.items,
      meta: result.meta,
    };
  }

  /**
   * Get suspended schools (paginated)
   * GET /admin/tenants/suspended?page=&limit=
   */
  @Get('suspended')
  @HttpCode(HttpStatus.OK)
  async getSuspended(@Query() query: ListPageQueryDto) {
    const result = await this.tenantService.listTenants({
      ...query,
      status: 'suspended',
      sort: 'createdAt',
      order: 'desc',
    });

    return {
      success: true,
      count: result.meta.total,
      data: result.items,
      meta: result.meta,
    };
  }

  /**
   * List users of a school
   * GET /admin/tenants/:id/users
   */
  @Get(':id/users')
  @HttpCode(HttpStatus.OK)
  async getUsers(@Param('id') id: string) {
    const users = await this.tenantService.getUsers(id);

    return {
      success: true,
      count: users.length,
      data: users,
    };
  }

  /**
   * Per-school stats (users, honest student proxy, documents)
   * GET /admin/tenants/:id/stats
   */
  @Get(':id/stats')
  @HttpCode(HttpStatus.OK)
  async getStats(@Param('id') id: string) {
    const stats = await this.tenantService.getStats(id);

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Impersonate a school (super admin only) — short-lived token with `imp` claim
   * POST /admin/tenants/:id/impersonate
   */
  @Post(':id/impersonate')
  @HttpCode(HttpStatus.OK)
  async impersonate(
    @Param('id') id: string,
    @Req() req: Request,
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.impersonate(id, actorId, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }

  /**
   * Stop impersonation (audit only — client restores original token)
   * POST /admin/tenants/:id/impersonate/stop
   */
  @Post(':id/impersonate/stop')
  @HttpCode(HttpStatus.OK)
  async stopImpersonation(
    @Param('id') id: string,
    @Req() req: Request,
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    await this.tenantService.stopImpersonation(id, actorId, ip, userAgent);

    return {
      success: true,
      message: 'Impersonation stopped',
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
   * Re-issue setup password link + re-notify 3 channels
   * POST /admin/tenants/:id/resend-access
   */
  @Post(':id/resend-access')
  @HttpCode(HttpStatus.OK)
  async resendAccess(
    @Param('id') id: string,
    @Req() req: Request,
    @CurrentUserId() actorId: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.resendAccess(id, ip, userAgent, actorId);

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

  /**
   * Mark monthly subscription payment (#43)
   * PATCH /admin/tenants/:id/subscription
   */
  @Patch(':id/subscription')
  @HttpCode(HttpStatus.OK)
  async markSubscription(
    @Param('id') id: string,
    @Body() dto: { action?: string },
    @Req() req: Request,
    @CurrentUserId() actorId: string,
  ) {
    if (dto?.action && dto.action !== 'mark_paid') {
      throw new BadRequestException('Unsupported action');
    }

    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.markSubscriptionPaid(
      id,
      actorId,
      ip,
      userAgent,
    );

    return {
      success: true,
      ...result,
    };
  }
}
