import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      // Verify token
      const payload = this.tokenService.verifyAccessToken(token);

      // Impersonation: skip strict tenant-match if `imp` claim present (plan #3)
      const imp = (payload as any).imp;
      const isImpersonation = !!imp;

      // Validate user exists and is active
      const user = await this.authService.validateUser(
        payload.sub,
        payload.tenantId,
        isImpersonation ? imp : undefined,
      );

      // Attach user to request
      request.user = user;
      request.userId = user.id;
      request.userTenantId = user.tenantId;
      if (isImpersonation) {
        request.impersonation = imp;
      }

      // Validate tenant matches (multi-tenant security) — skip if impersonating
      if (!isImpersonation) {
        const requestTenantId = request.tenantId || request.headers['x-tenant-id'];
        if (requestTenantId && requestTenantId !== user.tenantId) {
          throw new UnauthorizedException('Tenant mismatch - access denied');
        }
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid access token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
