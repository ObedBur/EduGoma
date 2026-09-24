import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import logger from '../../config/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      const tenantId = (req as any).tenantId || '-';
      logger.info({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ms,
        tenantId,
      });
    });
    next();
  }
}
