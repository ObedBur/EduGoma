import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
      tenantId?: string;
      userTenantId?: string;
    }
  }
}
