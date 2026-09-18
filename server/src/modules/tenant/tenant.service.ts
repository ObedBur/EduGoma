import { 
  Injectable, 
  ConflictException, 
  NotFoundException,
  BadRequestException,
  UnauthorizedException 
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { SmsService } from './services/sms.service';
import { AuditService, AuditAction } from '../auth/services/audit.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { ValidateTenantDto, RejectTenantDto } from './dto/admin-actions.dto';

@Injectable()
export class TenantService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
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
    await this.auditService.logTenantCreated(
      actor,
      tenant.id,
      tenant.id,
      ip,
      userAgent,
      { phone: dto.phone, name: dto.name, email: dto.email, commune: dto.commune, type: dto.type },
    );

    // Also log to TenantLog for backward compatibility
    await this.logTenantAction(tenant.id, 'created', ip, userAgent, {
      phone: dto.phone,
      name: dto.name,
    });

    // Send notification SMS (optional)
    await this.smsService.sendVerificationCode(dto.phone, `Votre école "${dto.name}" a été enregistrée. En attente de validation.`);

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
        validatedAt: true,
        validatedBy: true,
        createdAt: true,
      },
      orderBy: { validatedAt: 'desc' },
    });
  }

  /**
   * ADMIN: Validate a tenant (approve)
   */
  async validate(
    tenantId: string, 
    dto: ValidateTenantDto, 
    ip?: string, 
    userAgent?: string,
    actorId?: string
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
    await this.auditService.logTenantApproved(
      actor,
      tenant.id,
      tenantId,
      ip,
      userAgent,
      { validatedBy: dto.validatedBy },
    );

    // Also log to TenantLog for backward compatibility
    await this.logTenantAction(tenantId, 'validated', ip, userAgent, {
      validatedBy: dto.validatedBy,
    });

    // Send welcome SMS
    await this.smsService.sendWelcomeMessage(tenant.phone, tenant.name);

    return {
      message: `School "${tenant.name}" approved successfully`,
      tenant: {
        id: updated.id,
        name: updated.name,
        status: updated.status,
        validatedAt: updated.validatedAt,
      },
    };
  }

  /**
   * ADMIN: Reject a tenant
   */
  async reject(
    tenantId: string, 
    dto: RejectTenantDto, 
    ip?: string, 
    userAgent?: string,
    actorId?: string
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
    await this.auditService.logTenantRejected(
      actor,
      tenant.id,
      tenantId,
      ip,
      userAgent,
      { reason: dto.reason, rejectedBy: dto.validatedBy || 'Admin' },
    );

    // Also log to TenantLog for backward compatibility
    await this.logTenantAction(tenantId, 'rejected', ip, userAgent, {
      reason: dto.reason,
      rejectedBy: dto.validatedBy || 'Admin',
    });

    // Send rejection SMS
    await this.smsService.sendRejectionMessage(
      tenant.phone, 
      tenant.name, 
      dto.reason
    );

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
    reason?: string
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

    await this.auditService.logTenantDeactivated(
      actorId,
      tenant.id,
      tenantId,
      ip,
      userAgent,
      { reason },
    );

    await this.logTenantAction(tenantId, 'deactivated', ip, userAgent, { reason });

    return {
      message: `School "${tenant.name}" deactivated`,
      tenant: { id: updated.id, name: updated.name, status: updated.status },
    };
  }

  /**
   * ADMIN: Reactivate a suspended tenant
   */
  async reactivate(
    tenantId: string,
    actorId: string,
    ip?: string,
    userAgent?: string
  ) {
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

    await this.auditService.logTenantReactivated(
      actorId,
      tenant.id,
      tenantId,
      ip,
      userAgent,
    );

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
    userAgent?: string
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

    await this.auditService.logTenantUpdated(
      actorId,
      tenant.id,
      tenantId,
      ip,
      userAgent,
      { updatedFields: Object.keys(dto) },
    );

    await this.logTenantAction(tenantId, 'updated', ip, userAgent, { updatedFields: Object.keys(dto) });

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