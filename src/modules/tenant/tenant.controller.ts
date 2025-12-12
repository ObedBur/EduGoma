import { Controller, Post, Get, Body, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { TenantService } from './tenant.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { Public } from '../auth/decorators/auth.decorators';

/**
 * PUBLIC Tenant Controller
 * Endpoints for school registration and status checking (no auth required)
 */
@Controller('tenants')
@Public() // All routes are public
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Register a new school
   * POST /tenants/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterTenantDto, @Req() req: Request) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.register(dto, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }

  /**
   * Verify phone with SMS code
   * POST /tenants/verify-phone
   */
  @Post('verify-phone')
  @HttpCode(HttpStatus.OK)
  async verifyPhone(@Body() dto: VerifyPhoneDto, @Req() req: Request) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.tenantService.verifyPhone(dto, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }

  /**
   * Check school registration status
   * GET /tenants/check-status/:phone
   */
  @Get('check-status/:phone')
  @HttpCode(HttpStatus.OK)
  async checkStatus(@Param('phone') phone: string) {
    const tenant = await this.tenantService.checkStatus(phone);

    return {
      success: true,
      data: tenant,
    };
  }
}
