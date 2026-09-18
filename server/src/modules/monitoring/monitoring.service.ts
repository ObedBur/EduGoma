import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuditService, AuditAction } from '../auth/services/audit.service';
import { AlertService, AlertPayload } from './alert.service';
import { env } from '../../config/env';

interface ThresholdConfig {
  // Brute force: many failures from same IP/user in short time
  bruteForce: { failures: number; windowMinutes: number; severity: AlertPayload['severity'] };
  // Credential stuffing: failures across many users from same IP
  credentialStuffing: { failures: number; uniqueUsers: number; windowMinutes: number; severity: AlertPayload['severity'] };
  // Account targeted: repeated failures on same account
  accountTargeted: { failures: number; windowMinutes: number; severity: AlertPayload['severity'] };
  // Anomalous success: login success after many failures
  anomalousSuccess: { priorFailures: number; windowMinutes: number; severity: AlertPayload['severity'] };
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  // Default thresholds (can be overridden via env)
  private readonly thresholds: ThresholdConfig = {
    bruteForce: { 
      failures: env.MONITOR_BRUTE_FORCE_FAILURES || 20, 
      windowMinutes: env.MONITOR_BRUTE_FORCE_WINDOW || 10, 
      severity: 'HIGH' 
    },
    credentialStuffing: { 
      failures: env.MONITOR_CREDENTIAL_STUFFING_FAILURES || 30, 
      uniqueUsers: env.MONITOR_CREDENTIAL_STUFFING_USERS || 10, 
      windowMinutes: env.MONITOR_CREDENTIAL_STUFFING_WINDOW || 10, 
      severity: 'HIGH' 
    },
    accountTargeted: { 
      failures: env.MONITOR_ACCOUNT_TARGETED_FAILURES || 10, 
      windowMinutes: env.MONITOR_ACCOUNT_TARGETED_WINDOW || 15, 
      severity: 'MEDIUM' 
    },
    anomalousSuccess: { 
      priorFailures: env.MONITOR_ANOMALOUS_SUCCESS_FAILURES || 5, 
      windowMinutes: env.MONITOR_ANOMALOUS_SUCCESS_WINDOW || 30, 
      severity: 'MEDIUM' 
    },
  };

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private alertService: AlertService,
  ) {}

  /**
   * Main cron job - runs every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkFailedLogins(): Promise<void> {
    this.logger.debug('Running failed login monitoring check...');
    
    try {
      const tenants = await this.prisma.tenant.findMany({
        where: { status: 'active' },
        select: { id: true, name: true },
      });

      for (const tenant of tenants) {
        await this.checkTenant(tenant.id, tenant.name);
      }
    } catch (error) {
      this.logger.error(`Monitoring check failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Check a specific tenant for anomalies
   */
  async checkTenant(tenantId: string, tenantName: string): Promise<void> {
    const now = new Date();
    const windowMs = Math.max(
      this.thresholds.bruteForce.windowMinutes,
      this.thresholds.credentialStuffing.windowMinutes,
      this.thresholds.accountTargeted.windowMinutes,
      this.thresholds.anomalousSuccess.windowMinutes
    ) * 60 * 1000;
    const since = new Date(now.getTime() - windowMs);

    // Get all failed login attempts in window
    const failedAttempts = await this.auditService.getFailedLoginAttempts(tenantId, since);
    
    if (failedAttempts.length === 0) return;

    // Group by IP for brute force / credential stuffing
    const byIp = new Map<string, typeof failedAttempts>();
    const byUser = new Map<string, typeof failedAttempts>();
    
    for (const attempt of failedAttempts) {
      const ip = attempt.ip || 'unknown';
      const userId = attempt.userId;
      
      if (!byIp.has(ip)) byIp.set(ip, []);
      byIp.get(ip)!.push(attempt);
      
      if (!byUser.has(userId)) byUser.set(userId, []);
      byUser.get(userId)!.push(attempt);
    }

    // 1. Check brute force (same IP, many failures)
    for (const [ip, attempts] of byIp) {
      if (attempts.length >= this.thresholds.bruteForce.failures) {
        await this.alertService.sendAlert({
          type: 'BRUTE_FORCE',
          tenantId,
          severity: this.thresholds.bruteForce.severity,
          message: `Brute force detected from IP ${ip}: ${attempts.length} failed attempts in ${this.thresholds.bruteForce.windowMinutes}min`,
          metadata: {
            ip,
            tenantName,
            failureCount: attempts.length,
            windowMinutes: this.thresholds.bruteForce.windowMinutes,
            targetUsers: [...new Set(attempts.map(a => a.userId))].length,
          },
          timestamp: new Date(),
        });
      }

      // 2. Check credential stuffing (same IP, many different users)
      const uniqueUsers = new Set(attempts.map(a => a.userId)).size;
      if (attempts.length >= this.thresholds.credentialStuffing.failures && 
          uniqueUsers >= this.thresholds.credentialStuffing.uniqueUsers) {
        await this.alertService.sendAlert({
          type: 'CREDENTIAL_STUFFING',
          tenantId,
          severity: this.thresholds.credentialStuffing.severity,
          message: `Credential stuffing suspected from IP ${ip}: ${attempts.length} failures across ${uniqueUsers} users in ${this.thresholds.credentialStuffing.windowMinutes}min`,
          metadata: {
            ip,
            tenantName,
            failureCount: attempts.length,
            uniqueUsers,
            windowMinutes: this.thresholds.credentialStuffing.windowMinutes,
          },
          timestamp: new Date(),
        });
      }
    }

    // 3. Check account targeted (same user, many failures)
    for (const [userId, attempts] of byUser) {
      if (attempts.length >= this.thresholds.accountTargeted.failures) {
        await this.alertService.sendAlert({
          type: 'ACCOUNT_TARGETED',
          tenantId,
          severity: this.thresholds.accountTargeted.severity,
          message: `Account targeted: user ${userId} has ${attempts.length} failed attempts in ${this.thresholds.accountTargeted.windowMinutes}min`,
          metadata: {
            userId,
            tenantName,
            failureCount: attempts.length,
            windowMinutes: this.thresholds.accountTargeted.windowMinutes,
            ips: [...new Set(attempts.map(a => a.ip))],
          },
          timestamp: new Date(),
        });
      }
    }

    // 4. Check anomalous success (login success after many failures)
    // This requires checking successful logins too
    await this.checkAnomalousSuccess(tenantId, tenantName, since);
  }

  /**
   * Check for successful logins after repeated failures
   */
  private async checkAnomalousSuccess(tenantId: string, tenantName: string, since: Date): Promise<void> {
    const successfulLogins = await this.prisma.accessLog.findMany({
      where: {
        tenantId,
        action: AuditAction.LOGIN_SUCCESS,
        createdAt: { gte: since },
      },
      select: { userId: true, ip: true, createdAt: true },
    });

    for (const login of successfulLogins) {
      // Check failures for this user in the window before this success
      const priorFailures = await this.prisma.accessLog.count({
        where: {
          tenantId,
          userId: login.userId,
          action: AuditAction.LOGIN_FAILED,
          createdAt: {
            gte: new Date(login.createdAt.getTime() - this.thresholds.anomalousSuccess.windowMinutes * 60 * 1000),
            lt: login.createdAt,
          },
        },
      });

      if (priorFailures >= this.thresholds.anomalousSuccess.priorFailures) {
        await this.alertService.sendAlert({
          type: 'ANOMALOUS_SUCCESS',
          tenantId,
          severity: this.thresholds.anomalousSuccess.severity,
          message: `Successful login after ${priorFailures} failures for user ${login.userId} (possible credential stuffing success)`,
          metadata: {
            userId: login.userId,
            tenantName,
            priorFailures,
            successIp: login.ip,
            successTime: login.createdAt.toISOString(),
            windowMinutes: this.thresholds.anomalousSuccess.windowMinutes,
          },
          timestamp: new Date(),
        });
      }
    }
  }

  /**
   * Manual trigger for testing
   */
  async runManualCheck(tenantId?: string): Promise<{ checked: number; alerts: number }> {
    if (tenantId) {
      const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
      if (tenant) {
        await this.checkTenant(tenant.id, tenant.name);
        return { checked: 1, alerts: 0 }; // Alert count not tracked here
      }
      return { checked: 0, alerts: 0 };
    }

    const tenants = await this.prisma.tenant.findMany({
      where: { status: 'active' },
      select: { id: true, name: true },
    });

    for (const tenant of tenants) {
      await this.checkTenant(tenant.id, tenant.name);
    }

    return { checked: tenants.length, alerts: 0 };
  }
}