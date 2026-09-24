import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { env } from '../../config/env';
import { PrismaService } from '../../core/prisma/prisma.service';
import { getTenantCounts } from '../../stats/tenant-counts';
import { AuditAction, AuditService } from '../auth/services/audit.service';
import { buildSetupUrl, generateSetupTokenPlain, hashSetupToken } from '../auth/utils/setup-token';
import { RejectTenantDto, ValidateTenantDto } from './dto/admin-actions.dto';
import { ListTenantsQueryDto } from './dto/list-tenants.query';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { WhatsAppService } from './services/whatsapp.service';

const BCRYPT_ROUNDS = 12;

const TENANT_LIST_SELECT = {
  id: true,
  name: true,
  phone: true,
  email: true,
  commune: true,
  type: true,
  status: true,
  validatedAt: true,
  validatedBy: true,
  createdAt: true,
  subscriptionStatus: true,
  subscriptionPaidAt: true,
  _count: {
    select: { users: true },
  },
} as const;

export interface ListTenantsResult {
  items: Array<Record<string, unknown>>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    counts: {
      all: number;
      active: number;
      pending: number;
      suspended: number;
      trial: number;
      overdue: number;
    };
  };
}

@Injectable()
export class TenantService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
    private emailService: EmailService,
    private whatsappService: WhatsAppService,
    private auditService: AuditService,
  ) {}

  /**
   * ADMIN: Create a new school directly (status=pending)
   */
  async create(dto: RegisterTenantDto, ip?: string, userAgent?: string, actorId?: string) {
    // Check if phone already exists
    const existing = await this.prisma.tenant.findUnique({
      where: { phone: dto.phone },
    });

    if (existing) {
      throw new ConflictException('This school already exists with this phone number');
    }

    // Check if name already exists
    const existingName = await this.prisma.tenant.findUnique({
      where: { name: dto.name },
    });

    if (existingName) {
      throw new ConflictException('A school with this name already exists');
    }

    // Create tenant with pending status (no OTP verification needed)
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        commune: dto.commune,
        type: dto.type,
        status: 'pending',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        commune: true,
        type: true,
        status: true,
        createdAt: true,
      },
    });

    // Log action using AuditService
    const actor = actorId || 'system';
    await this.auditService.logTenantCreated(actor, tenant.id, tenant.id, ip, userAgent, {
      phone: dto.phone,
      name: dto.name,
      email: dto.email,
      commune: dto.commune,
      type: dto.type,
    });

    // Also log to TenantLog for backward compatibility
    await this.logTenantAction(tenant.id, 'created', ip, userAgent, {
      phone: dto.phone,
      name: dto.name,
    });

    // Send notification SMS (optional)
    await this.smsService.sendVerificationCode(
      dto.phone,
      `Votre école "${dto.name}" a été enregistrée. En attente de validation.`,
    );

    return {
      message: 'School created successfully. Waiting for admin validation.',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        phone: tenant.phone,
        status: tenant.status,
      },
    };
  }

  /**
   * PUBLIC: Check tenant status by phone
   */
  async checkStatus(phone: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { phone },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        rejectionReason: true,
        validatedAt: true,
        createdAt: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('École introuvable');
    }

    return tenant;
  }

  /**
   * ADMIN: Paginated list with sort, filters, search (#plan-1)
   */
  async listTenants(query: ListTenantsQueryDto): Promise<ListTenantsResult> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const where = this.buildTenantListWhere(query);

    const sortField = (query.sort ?? 'createdAt') as string;
    const order = query.order === 'asc' ? 'asc' : 'desc';

    const [items, total, counts] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        select: TENANT_LIST_SELECT,
        orderBy: [{ [sortField]: order }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tenant.count({ where }),
      getTenantCounts(this.prisma),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        counts,
      },
    };
  }

  private buildTenantListWhere(query: ListTenantsQueryDto): Record<string, unknown> {
    const and: Record<string, unknown>[] = [];
    const overdueCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    if (query.status && query.status !== 'all') {
      and.push({ status: query.status });
    }

    if (query.commune && query.commune !== 'all') {
      and.push({ commune: query.commune });
    }

    if (query.type && query.type !== 'all') {
      and.push({ type: query.type });
    }

    if (query.subscription && query.subscription !== 'all') {
      if (query.subscription === 'suspended') {
        and.push({ status: 'suspended' });
      } else if (query.subscription === 'trial') {
        and.push({
          status: { notIn: ['suspended', 'rejected'] },
          subscriptionStatus: { not: 'overdue' },
          subscriptionPaidAt: null,
        });
      } else if (query.subscription === 'active') {
        and.push({
          status: { notIn: ['suspended', 'rejected'] },
          subscriptionPaidAt: { gte: overdueCutoff },
        });
      } else if (query.subscription === 'overdue') {
        and.push({
          status: { notIn: ['suspended', 'rejected'] },
          OR: [
            { subscriptionStatus: 'overdue' },
            {
              AND: [
                { subscriptionPaidAt: { not: null } },
                { subscriptionPaidAt: { lt: overdueCutoff } },
              ],
            },
          ],
        });
      }
    }

    const search = query.search?.trim();
    if (search) {
      and.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    return and.length ? { AND: and } : {};
  }

  /**
   * ADMIN: Get all pending tenants
   */
  async getPending() {
    return this.prisma.tenant.findMany({
      where: {
        status: 'pending',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        commune: true,
        type: true,
        status: true,
        createdAt: true,
        subscriptionStatus: true,
        subscriptionPaidAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * ADMIN: Get all active tenants
   */
  async getActive() {
    return this.prisma.tenant.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        commune: true,
        type: true,
        status: true,
        validatedAt: true,
        validatedBy: true,
        createdAt: true,
        subscriptionStatus: true,
        subscriptionPaidAt: true,
      },
      orderBy: { validatedAt: 'desc' },
    });
  }

  /**
   * ADMIN: List users of a tenant (drawer)
   */
  async getUsers(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
        userRoles: {
          select: {
            role: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * ADMIN: Per-school stats — honest proxy for students (no Student model yet)
   * GET /admin/tenants/:id/stats
   */
  async getStats(tenantId: string): Promise<{
    users: number;
    usersActive: number;
    students: number | null;
    documents: { provided: string[]; missing: string[] };
    note: string;
  }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        status: true,
        validatedAt: true,
        rejectionReason: true,
        _count: { select: { users: true } },
      },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    const usersActive = await this.prisma.user.count({
      where: { tenantId, isActive: true },
    });

    const validated = tenant.validatedAt !== null && tenant.status === 'active';
    const rejected = tenant.status === 'rejected' || tenant.status === 'pending';

    const provided: string[] = [];
    const missing: string[] = [];

    if (validated) {
      provided.push(
        "Statuts de l'établissement",
        "Autorisation d'ouverture",
        "Pièce d'identité du responsable",
      );
    } else if (rejected && tenant.rejectionReason) {
      missing.push(`Rejeté : ${tenant.rejectionReason}`);
    } else {
      missing.push(
        "Statuts de l'établissement",
        "Autorisation d'ouverture",
        "Pièce d'identité du responsable",
      );
    }

    return {
      users: tenant._count.users,
      usersActive,
      students: null,
      documents: { provided, missing },
      note: "Le modèle Student n'existe pas encore — effectifs élèves à venir.",
    };
  }

  /**
   * ADMIN: Impersonate a school — short-lived token with `imp` claim (plan #3)
   * Audit: who / when / which tenant
   */
  async impersonate(
    tenantId: string,
    actorId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; tenant: { id: string; name: string } }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, status: true },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    if (tenant.status !== 'active') {
      throw new BadRequestException('Cannot impersonate a non-active school');
    }

    await this.auditService.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.SUPER_ADMIN_ACTION,
      resourceType: 'TENANT',
      resourceId: tenantId,
      ip,
      userAgent,
      metadata: { type: 'impersonation_started', tenantName: tenant.name },
    });

    const { jwtSign } = await import('../../libs/jwt.lib');
    const accessToken = jwtSign(
      {
        sub: actorId,
        tenantId,
        imp: {
          by: actorId,
          tenant: tenantId,
          at: new Date().toISOString(),
        },
      },
      { expiresIn: '30m' },
    );

    return {
      accessToken,
      tenant: { id: tenant.id, name: tenant.name },
    };
  }

  /**
   * ADMIN: Stop impersonation — audit only (client restores original token)
   */
  async stopImpersonation(
    tenantId: string,
    actorId: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.auditService.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.SUPER_ADMIN_ACTION,
      resourceType: 'TENANT',
      resourceId: tenantId,
      ip,
      userAgent,
      metadata: { type: 'impersonation_stopped' },
    });
  }

  /**
   * ADMIN: Get all suspended tenants
   */
  async getSuspended() {
    return this.prisma.tenant.findMany({
      where: { status: 'suspended' },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        commune: true,
        type: true,
        status: true,
        validatedAt: true,
        validatedBy: true,
        createdAt: true,
        subscriptionStatus: true,
        subscriptionPaidAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * ADMIN: Validate a tenant (approve)
   * Creates school admin user + one-time setup link + notifies SMS/WhatsApp/email.
   */
  async validate(
    tenantId: string,
    dto: ValidateTenantDto,
    ip?: string,
    userAgent?: string,
    actorId?: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    if (tenant.status !== 'pending') {
      throw new BadRequestException('Only schools in pending status can be approved');
    }

    // Update to active
    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        status: 'active',
        validatedAt: new Date(),
        validatedBy: dto.validatedBy,
      },
    });

    // Log action using AuditService
    const actor = actorId || dto.validatedBy || 'admin';
    await this.auditService.logTenantApproved(actor, tenant.id, tenantId, ip, userAgent, {
      validatedBy: dto.validatedBy,
    });

    // Also log to TenantLog for backward compatibility
    await this.logTenantAction(tenantId, 'validated', ip, userAgent, {
      validatedBy: dto.validatedBy,
    });

    const access = await this.issueSchoolAccess(updated);

    return {
      message: `School "${tenant.name}" approved successfully`,
      tenant: {
        id: updated.id,
        name: updated.name,
        status: updated.status,
        validatedAt: updated.validatedAt,
      },
      notifications: access.notifications,
      setupLinkExpiresAt: access.expiresAt,
    };
  }

  /**
   * ADMIN: Re-issue setup link + re-notify (idempotent for active schools)
   */
  async resendAccess(tenantId: string, ip?: string, userAgent?: string, actorId?: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    if (tenant.status !== 'active') {
      throw new BadRequestException('Only active schools can receive access links');
    }

    await this.logTenantAction(tenantId, 'access_resent', ip, userAgent, {
      actorId: actorId || 'system',
    });

    const access = await this.issueSchoolAccess(tenant);

    return {
      message: `Access link re-sent for "${tenant.name}"`,
      notifications: access.notifications,
      setupLinkExpiresAt: access.expiresAt,
    };
  }

  /**
   * Ensure school admin user exists, create SetupToken, notify on 3 channels.
   * Best-effort notifications — never throws after account is ready.
   */
  private async issueSchoolAccess(tenant: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    commune: string | null;
  }) {
    const user = await this.ensureSchoolAdminUser(tenant);

    // Revoke previous unused setup tokens
    await this.prisma.setupToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const tokenPlain = generateSetupTokenPlain();
    const tokenHash = hashSetupToken(tokenPlain);
    const ttlSeconds = env.SETUP_LINK_TTL_SECONDS;
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    const setupTtlMinutes = Math.max(1, Math.round(ttlSeconds / 60));
    const setupUrl = buildSetupUrl(env.CLIENT_URL, tokenPlain);

    await this.prisma.setupToken.create({
      data: {
        tokenHash,
        userId: user.id,
        tenantId: tenant.id,
        expiresAt,
      },
    });

    // Force password change until setup completes
    await this.prisma.user.update({
      where: { id: user.id },
      data: { mustChangePassword: true },
    });

    const [smsOk, whatsappOk, emailOk] = await Promise.all([
      this.smsService.sendWelcomeMessage(tenant.phone, tenant.name, setupUrl, setupTtlMinutes),
      this.whatsappService.sendWelcomeMessage({
        schoolName: tenant.name,
        phone: tenant.phone,
        setupUrl,
        setupTtlMinutes,
      }),
      this.emailService.sendWelcomeEmail({
        schoolName: tenant.name,
        phone: tenant.phone,
        email: tenant.email ?? '',
        commune: tenant.commune,
        setupUrl,
        setupTtlMinutes,
      }),
    ]);

    return {
      expiresAt,
      notifications: {
        sms: smsOk,
        whatsapp: whatsappOk,
        email: Boolean(tenant.email) ? emailOk : null,
      },
    };
  }

  /**
   * Find or create the school's Admin user (level-2 role).
   * Initial password is a random hash never sent to anyone.
   */
  private async ensureSchoolAdminUser(tenant: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
  }) {
    const or: Array<Record<string, string>> = [{ phone: tenant.phone }];
    if (tenant.email) {
      or.push({ email: tenant.email });
    }

    let user = await this.prisma.user.findFirst({
      where: { tenantId: tenant.id, OR: or },
    });

    if (!user) {
      // Prefer an existing platform user matching phone/email if any (avoid unique clash)
      const clash = await this.prisma.user.findFirst({ where: { OR: or } });
      if (clash) {
        user = clash;
        await this.prisma.user.update({
          where: { id: clash.id },
          data: { tenantId: tenant.id, isActive: true, mustChangePassword: true },
        });
      } else {
        const placeholderSecret = `setup-${tenant.id}-${Date.now()}`;
        const passwordHash = await bcrypt.hash(placeholderSecret, BCRYPT_ROUNDS);
        user = await this.prisma.user.create({
          data: {
            email: tenant.email ?? null,
            phone: tenant.phone,
            password: passwordHash,
            firstName: tenant.name,
            lastName: 'Admin',
            tenantId: tenant.id,
            isActive: true,
            mustChangePassword: true,
          },
        });
      }
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isActive: true, mustChangePassword: true },
      });
    }

    // Ensure Admin role (level 2) on this tenant
    let adminRole = await this.prisma.role.findFirst({
      where: { tenantId: tenant.id, name: 'Admin' },
    });
    if (!adminRole) {
      adminRole = await this.prisma.role.create({
        data: {
          tenantId: tenant.id,
          name: 'Admin',
          level: 2,
        },
      });
    }

    const link = await this.prisma.userRole.findFirst({
      where: { userId: user.id, roleId: adminRole.id },
    });
    if (!link) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: adminRole.id },
      });
    }

    return user;
  }

  /**
   * ADMIN: Reject a tenant
   */
  async reject(
    tenantId: string,
    dto: RejectTenantDto,
    ip?: string,
    userAgent?: string,
    actorId?: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    // Update to rejected
    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        status: 'rejected',
        rejectionReason: dto.reason,
        validatedBy: dto.validatedBy || 'Admin',
      },
    });

    // Log action using AuditService
    const actor = actorId || dto.validatedBy || 'admin';
    await this.auditService.logTenantRejected(actor, tenant.id, tenantId, ip, userAgent, {
      reason: dto.reason,
      rejectedBy: dto.validatedBy || 'Admin',
    });

    // Also log to TenantLog for backward compatibility
    await this.logTenantAction(tenantId, 'rejected', ip, userAgent, {
      reason: dto.reason,
      rejectedBy: dto.validatedBy || 'Admin',
    });

    // Send rejection SMS
    await this.smsService.sendRejectionMessage(tenant.phone, tenant.name, dto.reason);

    return {
      message: `School "${tenant.name}" rejected`,
      tenant: {
        id: updated.id,
        name: updated.name,
        status: updated.status,
        rejectionReason: updated.rejectionReason,
      },
    };
  }

  /**
   * ADMIN: Deactivate (suspend) a tenant
   */
  async deactivate(
    tenantId: string,
    actorId: string,
    ip?: string,
    userAgent?: string,
    reason?: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    if (tenant.status === 'rejected') {
      throw new BadRequestException('Cannot deactivate a rejected school');
    }

    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'suspended' },
    });

    await this.auditService.logTenantDeactivated(actorId, tenant.id, tenantId, ip, userAgent, {
      reason,
    });

    await this.logTenantAction(tenantId, 'deactivated', ip, userAgent, { reason });

    return {
      message: `School "${tenant.name}" deactivated`,
      tenant: { id: updated.id, name: updated.name, status: updated.status },
    };
  }

  /**
   * ADMIN: Reactivate a suspended tenant
   */
  async reactivate(tenantId: string, actorId: string, ip?: string, userAgent?: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    if (tenant.status !== 'suspended') {
      throw new BadRequestException('Only suspended schools can be reactivated');
    }

    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'active' },
    });

    await this.auditService.logTenantReactivated(actorId, tenant.id, tenantId, ip, userAgent);

    await this.logTenantAction(tenantId, 'reactivated', ip, userAgent);

    return {
      message: `School "${tenant.name}" reactivated`,
      tenant: { id: updated.id, name: updated.name, status: updated.status },
    };
  }

  /**
   * ADMIN: Update tenant details
   */
  async update(
    tenantId: string,
    dto: Partial<RegisterTenantDto>,
    actorId: string,
    ip?: string,
    userAgent?: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: dto,
    });

    await this.auditService.logTenantUpdated(actorId, tenant.id, tenantId, ip, userAgent, {
      updatedFields: Object.keys(dto),
    });

    await this.logTenantAction(tenantId, 'updated', ip, userAgent, {
      updatedFields: Object.keys(dto),
    });

    return {
      message: `School "${tenant.name}" updated`,
      tenant: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        commune: updated.commune,
        type: updated.type,
        status: updated.status,
      },
    };
  }

  /**
   * ADMIN: Mark monthly subscription payment (#43)
   * POST/PATCH /admin/schools/:id/subscription { action: "mark_paid" }
   */
  async markSubscriptionPaid(tenantId: string, actorId: string, ip?: string, userAgent?: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('School not found');
    }

    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Idempotent: one payment per period
    const existing = await this.prisma.payment.findUnique({
      where: {
        tenantId_period: { tenantId, period },
      },
    });

    if (!existing) {
      await this.prisma.payment.create({
        data: {
          tenantId,
          period,
          paidAt: now,
          recordedBy: actorId,
          note: 'mark_paid',
        },
      });
    }

    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionStatus: 'active',
        subscriptionPaidAt: now,
        // If suspended for non-payment, reactivate on paid
        ...(tenant.status === 'suspended' ? { status: 'active' } : {}),
      },
    });

    await this.auditService.logAction({
      userId: actorId,
      tenantId,
      action: AuditAction.SUBSCRIPTION_MARKED_PAID,
      resourceType: 'PAYMENT',
      resourceId: tenantId,
      ip,
      userAgent,
      metadata: { period, amount: null, tenantName: tenant.name },
    });

    await this.logTenantAction(tenantId, 'subscription_paid', ip, userAgent, {
      period,
    });

    return {
      message: 'Le paiement de ce mois a été enregistré.',
      data: {
        id: updated.id,
        subscription: 'Actif',
        subscriptionTone: 'green',
        subscriptionDetail: 'Paiement enregistré ce mois',
      },
    };
  }

  /**
   * ADMIN: Check if tenant has paid subscription for current period (#43)
   */
  async hasActiveSubscription(tenantId: string): Promise<boolean> {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const payment = await this.prisma.payment.findUnique({
      where: {
        tenantId_period: { tenantId, period },
      },
    });

    if (payment) return true;

    // Fallback: paidAt within last 30 days
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { subscriptionStatus: true, subscriptionPaidAt: true },
    });

    if (tenant?.subscriptionStatus === 'active' && tenant.subscriptionPaidAt) {
      const days = (now.getTime() - tenant.subscriptionPaidAt.getTime()) / (24 * 60 * 60 * 1000);
      return days <= 30;
    }

    return false;
  }

  /**
   * Helper: Log tenant actions (for backward compatibility with TenantLog)
   */
  private async logTenantAction(
    tenantId: string,
    action: string,
    ip?: string,
    userAgent?: string,
    metadata?: any,
  ) {
    await this.prisma.tenantLog.create({
      data: {
        tenantId,
        action,
        ip,
        userAgent,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  }
}
