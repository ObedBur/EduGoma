import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

export enum AuditAction {
  REGISTER = 'REGISTER',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}

export interface AuditLogData {
  userId: string;
  tenantId: string;
  action: AuditAction;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log an audit action to the database
   */
  async logAction(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.accessLog.create({
        data: {
          userId: data.userId,
          tenantId: data.tenantId,
          action: data.action,
          ip: data.ip,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      // Log error but don't throw - audit logging should not break the main flow
      console.error('Failed to log audit action:', error);
    }
  }

  /**
   * Log successful registration
   */
  async logRegister(userId: string, tenantId: string, ip?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.REGISTER,
      ip,
      userAgent,
    });
  }

  /**
   * Log successful login
   */
  async logLoginSuccess(userId: string, tenantId: string, ip?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.LOGIN_SUCCESS,
      ip,
      userAgent,
    });
  }

  /**
   * Log failed login attempt
   */
  async logLoginFailed(userId: string, tenantId: string, ip?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.LOGIN_FAILED,
      ip,
      userAgent,
    });
  }

  /**
   * Log token refresh
   */
  async logRefreshToken(userId: string, tenantId: string, ip?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.REFRESH_TOKEN,
      ip,
      userAgent,
    });
  }

  /**
   * Log logout
   */
  async logLogout(userId: string, tenantId: string, ip?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.LOGOUT,
      ip,
      userAgent,
    });
  }

  /**
   * Log password change
   */
  async logPasswordChange(userId: string, tenantId: string, ip?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.PASSWORD_CHANGE,
      ip,
      userAgent,
    });
  }

  /**
   * Get audit logs for a user
   */
  async getUserAuditLogs(userId: string, limit = 50) {
    return this.prisma.accessLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get audit logs for a tenant
   */
  async getTenantAuditLogs(tenantId: string, limit = 100) {
    return this.prisma.accessLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Get failed login attempts for security monitoring
   */
  async getFailedLoginAttempts(tenantId: string, since: Date) {
    return this.prisma.accessLog.findMany({
      where: {
        tenantId,
        action: AuditAction.LOGIN_FAILED,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }
}
