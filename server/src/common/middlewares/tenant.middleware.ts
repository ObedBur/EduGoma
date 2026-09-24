import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Strategy: prefer header x-tenant-id, fallback to host (subdomain) if needed
    const headerTenant = req.header('x-tenant-id');
    let tenantId = headerTenant;

    // Optional: extract tenant from host e.g. tenant.example.com
    if (!tenantId && req.headers.host) {
      const host = req.headers.host.split(':')[0];
      // Skip localhost / IP addresses — only multi-label hostnames
      const isIp =
        /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host === 'localhost' || host.includes(':');
      if (!isIp) {
        const parts = host.split('.');
        if (parts.length > 2) tenantId = parts[0]; // simple subdomain strategy
      }
    }

    if (!tenantId) {
      // we could allow anonymous public endpoints — decide policy
      (req as any).tenantId = null;
      return next();
    }

    // validate tenant exists
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new BadRequestException('Invalid tenant');
    (req as any).tenantId = tenantId;
    next();
  }
}
