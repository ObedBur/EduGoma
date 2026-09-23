import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
      tenantId?: string;
      userTenantId?: string;
      /** Present when super admin is impersonating a tenant (plan #3) */
      impersonation?: { by: string; tenant: string; at: string };
    }
  }
}
