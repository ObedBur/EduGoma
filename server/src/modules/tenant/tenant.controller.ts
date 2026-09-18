import { Controller, Get, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { TenantService } from './tenant.service';
import { Public } from '../auth/decorators/auth.decorators';

/**
 * PUBLIC Tenant Controller
 * Endpoint for checking school registration status (no auth required)
 */
@Controller('tenants')
@Public()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

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