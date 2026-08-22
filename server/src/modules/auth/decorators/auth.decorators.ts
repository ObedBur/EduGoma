import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark a route as public (skip JWT authentication)
 * Usage: @Public()
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * Decorator to require specific roles
 * Usage: @Roles('admin', 'manager')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * Decorator to require specific permissions
 * Usage: @Permissions('users:create', 'users:update')
 */
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
