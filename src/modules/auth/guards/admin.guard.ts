import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

/**
 * AdminGuard - Vérifie que l'utilisateur connecté a le rôle "Admin"
 * 
 * USAGE:
 * @UseGuards(JwtAuthGuard, AdminGuard)
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by JwtAuthGuard

    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has Admin role
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

    // Check if any of the user's roles is "Admin"
    const isAdmin = userWithRoles.userRoles.some(
      (userRole) => userRole.role.name === 'Admin'
    );

    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
