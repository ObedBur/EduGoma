import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

export enum AuditAction {
  // Auth actions
  REGISTER = 'REGISTER',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  PASSWORD_RESET_FAILED = 'PASSWORD_RESET_FAILED',

  // Tenant/School actions
  TENANT_CREATED = 'TENANT_CREATED',
  TENANT_UPDATED = 'TENANT_UPDATED',
  TENANT_APPROVED = 'TENANT_APPROVED',
  TENANT_DEACTIVATED = 'TENANT_DEACTIVATED',
  TENANT_REACTIVATED = 'TENANT_REACTIVATED',
  TENANT_REJECTED = 'TENANT_REJECTED',
  TENANT_SUSPENDED = 'TENANT_SUSPENDED',
  SUBSCRIPTION_MARKED_PAID = 'SUBSCRIPTION_MARKED_PAID',

  // User actions
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
  USER_DELETED = 'USER_DELETED',

  // Role actions
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REVOKED = 'ROLE_REVOKED',
  ROLE_CREATED = 'ROLE_CREATED',
  ROLE_UPDATED = 'ROLE_UPDATED',
  ROLE_DELETED = 'ROLE_DELETED',

  // Permission actions
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',

  // System actions
  SYSTEM_CONFIG_CHANGED = 'SYSTEM_CONFIG_CHANGED',
  SUPER_ADMIN_ACTION = 'SUPER_ADMIN_ACTION',
}

export interface AuditLogData {
  userId: string;
  tenantId: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
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
          resourceType: data.resourceType,
          resourceId: data.resourceId,
          ip: data.ip,
          userAgent: data.userAgent,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        },
      });
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  }

  // ==================== AUTH ACTIONS ====================

  async logRegister(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({ userId, tenantId, action: AuditAction.REGISTER, ip, userAgent });
  }

  async logLoginSuccess(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({ userId, tenantId, action: AuditAction.LOGIN_SUCCESS, ip, userAgent });
  }

  async logLoginFailed(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({ userId, tenantId, action: AuditAction.LOGIN_FAILED, ip, userAgent });
  }

  async logRefreshToken(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({ userId, tenantId, action: AuditAction.REFRESH_TOKEN, ip, userAgent });
  }

  async logLogout(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({ userId, tenantId, action: AuditAction.LOGOUT, ip, userAgent });
  }

  async logPasswordChange(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({ userId, tenantId, action: AuditAction.PASSWORD_CHANGE, ip, userAgent });
  }

  async logAccountLocked(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.ACCOUNT_LOCKED,
      ip,
      userAgent,
      metadata,
    });
  }

  async logAccountUnlocked(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({ userId, tenantId, action: AuditAction.ACCOUNT_UNLOCKED, ip, userAgent });
  }

  async logPasswordResetRequested(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.PASSWORD_RESET_REQUESTED,
      ip,
      userAgent,
    });
  }

  async logPasswordResetCompleted(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.PASSWORD_RESET_COMPLETED,
      ip,
      userAgent,
    });
  }

  async logPasswordResetFailed(
    userId: string,
    tenantId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAction({
      userId,
      tenantId,
      action: AuditAction.PASSWORD_RESET_FAILED,
      ip,
      userAgent,
    });
  }

  // ==================== TENANT/SCHOOL ACTIONS ====================

  async logTenantCreated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.TENANT_CREATED,
      resourceType: 'TENANT',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logTenantUpdated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.TENANT_UPDATED,
      resourceType: 'TENANT',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logTenantApproved(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.TENANT_APPROVED,
      resourceType: 'TENANT',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logTenantDeactivated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.TENANT_DEACTIVATED,
      resourceType: 'TENANT',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logTenantReactivated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.TENANT_REACTIVATED,
      resourceType: 'TENANT',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logTenantRejected(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.TENANT_REJECTED,
      resourceType: 'TENANT',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logTenantSuspended(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.TENANT_SUSPENDED,
      resourceType: 'TENANT',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  // ==================== USER ACTIONS ====================

  async logUserCreated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.USER_CREATED,
      resourceType: 'USER',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logUserUpdated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.USER_UPDATED,
      resourceType: 'USER',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logUserDeactivated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.USER_DEACTIVATED,
      resourceType: 'USER',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logUserDeleted(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.USER_DELETED,
      resourceType: 'USER',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  // ==================== ROLE ACTIONS ====================

  async logRoleAssigned(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.ROLE_ASSIGNED,
      resourceType: 'ROLE',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logRoleRevoked(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.ROLE_REVOKED,
      resourceType: 'ROLE',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logRoleCreated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.ROLE_CREATED,
      resourceType: 'ROLE',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logRoleUpdated(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.ROLE_UPDATED,
      resourceType: 'ROLE',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logRoleDeleted(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.ROLE_DELETED,
      resourceType: 'ROLE',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  // ==================== PERMISSION ACTIONS ====================

  async logPermissionGranted(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.PERMISSION_GRANTED,
      resourceType: 'PERMISSION',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logPermissionRevoked(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.PERMISSION_REVOKED,
      resourceType: 'PERMISSION',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  // ==================== SYSTEM ACTIONS ====================

  async logSystemConfigChanged(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.SYSTEM_CONFIG_CHANGED,
      resourceType: 'SYSTEM_CONFIG',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  async logSuperAdminAction(
    actorId: string,
    tenantId: string,
    resourceId: string,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.SUPER_ADMIN_ACTION,
      resourceType: 'SUPER_ADMIN',
      resourceId,
      ip,
      userAgent,
      metadata,
    });
  }

  // ==================== QUERY METHODS ====================

  async getUserAuditLogs(userId: string, limit = 50) {
    return this.prisma.accessLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

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
          select: { id: true, email: true, phone: true },
        },
      },
    });
  }

  async getAuditLogsByResource(
    tenantId: string,
    resourceType: string,
    resourceId: string,
    limit = 50,
  ) {
    return this.prisma.accessLog.findMany({
      where: {
        tenantId,
        resourceType,
        resourceId,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, email: true, phone: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async getAuditLogsByAction(tenantId: string, action: AuditAction, limit = 100) {
    return this.prisma.accessLog.findMany({
      where: { tenantId, action },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, email: true, phone: true, firstName: true, lastName: true },
        },
      },
    });
  }
}
