import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(private prisma: PrismaService) {}

  async getSystemHealth() {
    const [dbOk, dbLatency, memory, tenantCount, userCount] = await Promise.all([
      this.checkDatabase(),
      this.measureDbLatency(),
      this.getMemoryUsage(),
      this.prisma.tenant.count(),
      this.prisma.user.count(),
    ]);

    const uptimeMs = Date.now() - this.startTime;
    const uptime = this.formatUptime(uptimeMs);

    return {
      status: dbOk ? 'healthy' : 'degraded',
      uptime,
      uptimeMs,
      timestamp: new Date().toISOString(),
      database: {
        status: dbOk ? 'connected' : 'error',
        latencyMs: dbLatency,
      },
      memory: {
        heapUsedMB: memory.heapUsed,
        heapTotalMB: memory.heapTotal,
        rssUsedMB: memory.rss,
        externalMB: memory.external,
        usagePercent: memory.usagePercent,
      },
      stats: {
        totalTenants: tenantCount,
        totalUsers: userCount,
      },
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      this.logger.error('Database health check failed');
      return false;
    }
  }

  private async measureDbLatency(): Promise<number> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      return -1;
    }
    return Date.now() - start;
  }

  private getMemoryUsage() {
    const mem = process.memoryUsage();
    const heapUsed = Math.round(mem.heapUsed / 1024 / 1024 * 10) / 10;
    const heapTotal = Math.round(mem.heapTotal / 1024 / 1024 * 10) / 10;
    const rss = Math.round(mem.rss / 1024 / 1024 * 10) / 10;
    const external = Math.round(mem.external / 1024 / 1024 * 10) / 10;
    const usagePercent = Math.round((heapUsed / heapTotal) * 100 * 10) / 10;

    return { heapUsed, heapTotal, rss, external, usagePercent };
  }

  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m ${seconds % 60}s`;
  }
}
