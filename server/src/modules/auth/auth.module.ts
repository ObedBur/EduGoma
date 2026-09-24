import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuditService } from './services/audit.service';
import { TokenService } from './services/token.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuditService,
    PrismaService,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    // Apply JwtAuthGuard globally (can be overridden with @Public())
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, TokenService, AuditService, JwtAuthGuard, RolesGuard, PermissionsGuard],
})
export class AuthModule {}
