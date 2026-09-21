import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

/**
 * SuperAdminGuard - Vérifie que l'utilisateur a un rôle avec level=1 (Super Admin)
 *
 * Différence avec AdminGuard :
 * - AdminGuard vérifie le nom "Admin" (level 2)
 * - SuperAdminGuard vérifie le level 1 (accès plateforme)
 *
 * USAGE:
 * @UseGuards(JwtAuthGuard, SuperAdminGuard)
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated');
    }

    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!userWithRoles) {
      throw new ForbiddenException('User not found');
    }

    const isSuperAdmin = userWithRoles.userRoles.some(
      (userRole) =>
        userRole.role.level === 1 || userRole.role.name === 'Super Admin',
    );

    if (!isSuperAdmin) {
      throw new ForbiddenException('Super Admin access required');
    }

    return true;
  }
}
