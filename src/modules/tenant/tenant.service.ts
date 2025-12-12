import { 
  Injectable, 
  ConflictException, 
  NotFoundException,
  BadRequestException,
  UnauthorizedException 
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { SmsService } from './services/sms.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { ValidateTenantDto, RejectTenantDto } from './dto/admin-actions.dto';

@Injectable()
export class TenantService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
  ) {}

  /**
   * PUBLIC: Register a new school (status=pending)
   */
  async register(dto: RegisterTenantDto, ip?: string, userAgent?: string) {
    // Check if phone already exists
    const existing = await this.prisma.tenant.findUnique({
      where: { phone: dto.phone },
    });

    if (existing) {
      throw new ConflictException('Cette école existe déjà avec ce numéro');
    }

    // Check if name already exists
    const existingName = await this.prisma.tenant.findUnique({
      where: { name: dto.name },
    });

    if (existingName) {
      throw new ConflictException('Une école avec ce nom existe déjà');
    }

    // Generate verification code
    const validationCode = this.smsService.generateVerificationCode();

    // Create tenant with pending status
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        commune: dto.commune,
        type: dto.type,
        status: 'pending',
        validationCode,
        isPhoneVerified: false,
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

    // Log action
    await this.logTenantAction(tenant.id, 'registered', ip, userAgent, {
      phone: dto.phone,
      name: dto.name,
    });

    // Send SMS with verification code
    await this.smsService.sendVerificationCode(dto.phone, validationCode);

    return {
      message: 'École enregistrée. Vérifiez votre téléphone pour le code SMS.',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        phone: tenant.phone,
        status: tenant.status,
      },
    };
  }

  /**
   * PUBLIC: Verify phone number with SMS code
   */
  async verifyPhone(dto: VerifyPhoneDto, ip?: string, userAgent?: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { phone: dto.phone },
    });

    if (!tenant) {
      throw new NotFoundException('École introuvable');
    }

    if (tenant.isPhoneVerified) {
      throw new BadRequestException('Téléphone déjà vérifié');
    }

    if (tenant.validationCode !== dto.code) {
      throw new UnauthorizedException('Code de vérification invalide');
    }

    // Mark phone as verified
    const updated = await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: { 
        isPhoneVerified: true,
        validationCode: null, // Clear code after verification
      },
    });

    // Log action
    await this.logTenantAction(tenant.id, 'phone_verified', ip, userAgent);

    return {
      message: 'Téléphone vérifié avec succès. En attente de validation admin.',
      status: updated.status,
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
        isPhoneVerified: true,
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
        isPhoneVerified: true, // Only show phone-verified schools
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        commune: true,
        type: true,
        status: true,
        isPhoneVerified: true,
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
    userAgent?: string
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('École introuvable');
    }

    if (tenant.status !== 'pending') {
      throw new BadRequestException('Seules les écoles en attente peuvent être validées');
    }

    if (!tenant.isPhoneVerified) {
      throw new BadRequestException('Le téléphone doit être vérifié avant validation');
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

    // Log action
    await this.logTenantAction(tenantId, 'validated', ip, userAgent, {
      validatedBy: dto.validatedBy,
    });

    // Send welcome SMS
    await this.smsService.sendWelcomeMessage(tenant.phone, tenant.name);

    return {
      message: `École "${tenant.name}" validée avec succès`,
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
    userAgent?: string
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('École introuvable');
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

    // Log action
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
      message: `École "${tenant.name}" rejetée`,
      tenant: {
        id: updated.id,
        name: updated.name,
        status: updated.status,
        rejectionReason: updated.rejectionReason,
      },
    };
  }

  /**
   * Helper: Log tenant actions
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
