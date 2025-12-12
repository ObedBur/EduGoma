import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to get current user from request
 * Usage: @CurrentUser() user: User
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * Decorator to get current user ID from request
 * Usage: @CurrentUserId() userId: string
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

/**
 * Decorator to get current tenant ID from request
 * Usage: @CurrentTenantId() tenantId: string
 */
export const CurrentTenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId || request.tenantId;
  },
);
