import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { TokenService } from './services/token.service';
import { AuditService } from './services/audit.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { env } from '../../config/env';

const BCRYPT_ROUNDS = 12; // Strong hashing with 12 rounds

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    tenantId: string;
  };
}

interface LockoutStatus {
  isLocked: boolean;
  lockedUntil?: Date;
  failedAttempts: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private auditService: AuditService,
  ) {}

  /**
   * Check if account is locked and get lockout status
   */
  private async getLockoutStatus(userId: string): Promise<LockoutStatus> {
    const now = new Date();
    
    // Get the most recent login attempt
    const latestAttempt = await this.prisma.loginAttempt.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestAttempt) {
      return { isLocked: false, failedAttempts: 0 };
    }

    // If there's a lockUntil and it's in the future, account is locked
    if (latestAttempt.lockedUntil && latestAttempt.lockedUntil > now) {
      return {
        isLocked: true,
        lockedUntil: latestAttempt.lockedUntil,
        failedAttempts: 0, // Don't expose count when locked
      };
    }

    // Count consecutive failed attempts since last success
    const failedAttempts = await this.prisma.loginAttempt.count({
      where: {
        userId,
        success: false,
        createdAt: {
          gte: latestAttempt.createdAt,
        },
      },
    });

    return { isLocked: false, failedAttempts };
  }

  /**
   * Record a login attempt
   */
  private async recordLoginAttempt(
    userId: string,
    tenantId: string,
    success: boolean,
    ip?: string,
    userAgent?: string,
    lockedUntil?: Date,
  ): Promise<void> {
    await this.prisma.loginAttempt.create({
      data: {
        userId,
        tenantId,
        success,
        ip,
        userAgent,
        lockedUntil,
      },
    });
  }

  /**
   * Reset failed attempts on successful login
   */
  private async resetFailedAttempts(userId: string): Promise<void> {
    // No need to delete, just count from last success
    // This is handled by getLockoutStatus logic
  }

  /**
   * Check if new password matches any in history
   */
  private async checkPasswordHistory(userId: string, plainPassword: string): Promise<void> {
    const limit = env.AUTH_PASSWORD_HISTORY_LIMIT;
    console.log('[DEBUG] checkPasswordHistory called with limit:', limit);
    if (limit <= 0) {
      console.log('[DEBUG] Limit <= 0, skipping check');
      return; // Disabled
    }

    const history = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { passwordHash: true },
    });

    console.log('[DEBUG] History entries:', history.length);
    for (const record of history) {
      const matches = await bcrypt.compare(plainPassword, record.passwordHash);
      if (matches) {
        console.log('[DEBUG] Match found! Throwing error');
        throw new BadRequestException(
          `Password has been used recently. Please choose a different password (last ${limit} passwords cannot be reused).`,
        );
      }
    }
    console.log('[DEBUG] No match found, check passed');
  }

  /**
   * Store old password in history (before change) and cleanup old entries
   */
  private async storePasswordHistory(userId: string, tenantId: string, oldPasswordHash: string): Promise<void> {
    const limit = env.AUTH_PASSWORD_HISTORY_LIMIT;
    if (limit <= 0) return; // Disabled

    // Store OLD password hash in history
    await this.prisma.passwordHistory.create({
      data: {
        userId,
        tenantId,
        passwordHash: oldPasswordHash,
      },
    });

    // Cleanup old entries beyond limit
    const count = await this.prisma.passwordHistory.count({ where: { userId } });
    if (count > limit) {
      const toDelete = await this.prisma.passwordHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        take: count - limit,
        select: { id: true },
      });

      await this.prisma.passwordHistory.deleteMany({
        where: { id: { in: toDelete.map(r => r.id) } },
      });
    }
  }

  /**
   * Register a new user with strong password hashing
   */
  async register(dto: RegisterDto, ip?: string, userAgent?: string): Promise<{ user: any }> {
    // Validate that email OR phone is provided
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    // Validate tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('Invalid tenant ID');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.phone ? { phone: dto.phone } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    // Hash password with 12 rounds (strong security)
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: passwordHash,
        tenantId: dto.tenantId,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        tenantId: true,
        createdAt: true,
      },
    });

    // Log registration
    await this.auditService.logRegister(user.id, user.tenantId, ip, userAgent);

    return { user };
  }

  /**
   * Login with email or phone
   */
  async login(dto: LoginDto, ip?: string, userAgent?: string): Promise<AuthResponse> {
    // Validate that email OR phone is provided
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    // Find user by email or phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.phone ? { phone: dto.phone } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
    });

    if (!user) {
      // Don't reveal if user exists or not
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    // Check account lockout
    const lockoutStatus = await this.getLockoutStatus(user.id);
    if (lockoutStatus.isLocked) {
      await this.auditService.logAccountLocked(user.id, user.tenantId, ip, userAgent, {
        lockedUntil: lockoutStatus.lockedUntil?.toISOString(),
      });
      throw new UnauthorizedException('Account temporarily locked due to multiple failed attempts');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      // Record failed attempt
      await this.recordLoginAttempt(user.id, user.tenantId, false, ip, userAgent);
      
      // Log failed login attempt
      await this.auditService.logLoginFailed(user.id, user.tenantId, ip, userAgent);

      // Check if we should lock the account
      const newLockoutStatus = await this.getLockoutStatus(user.id);
      if (newLockoutStatus.failedAttempts >= env.AUTH_LOCKOUT_THRESHOLD) {
        const lockedUntil = new Date(Date.now() + env.AUTH_LOCKOUT_DURATION * 1000);
        
        // Record the lockout
        await this.recordLoginAttempt(user.id, user.tenantId, false, ip, userAgent, lockedUntil);
        
        // Log account lockout
        await this.auditService.logAccountLocked(user.id, user.tenantId, ip, userAgent, {
          failedAttempts: newLockoutStatus.failedAttempts,
          lockedUntil: lockedUntil.toISOString(),
        });
        
        throw new UnauthorizedException('Account temporarily locked due to multiple failed attempts');
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    // Password is valid - record successful attempt and reset counter
    await this.recordLoginAttempt(user.id, user.tenantId, true, ip, userAgent);

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      phone: user.phone,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.id,
      tenantId: user.tenantId,
    }, dto.rememberMe);

    // Store refresh token hash in database
    await this.tokenService.storeRefreshToken(
      user.id,
      user.tenantId,
      refreshToken,
      userAgent,
    );

    // Log successful login
    await this.auditService.logLoginSuccess(user.id, user.tenantId, ip, userAgent);

    // Log account unlock if it was previously locked
    const previousLockoutStatus = await this.getLockoutStatus(user.id);
    if (previousLockoutStatus.isLocked) {
      await this.auditService.logAccountUnlocked(user.id, user.tenantId, ip, userAgent);
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
      },
    };
  }

  /**
   * Refresh access token with token rotation
   */
  async refresh(refreshToken: string, ip?: string, userAgent?: string, rememberMe = false): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    // Verify refresh token and get stored token data
    let payload: any;
    let storedToken: any;

    try {
      const result = await this.tokenService.verifyStoredRefreshToken(refreshToken);
      payload = result.payload;
      storedToken = result.storedToken;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid refresh token');
    }

    // Get user data
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Generate NEW tokens (rotation)
    const newAccessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      phone: user.phone,
    });

    const newRefreshToken = this.tokenService.generateRefreshToken({
      sub: user.id,
      tenantId: user.tenantId,
    }, rememberMe);

    // Revoke old refresh token
    await this.tokenService.revokeRefreshToken(storedToken.id);

    // Store new refresh token hash
    await this.tokenService.storeRefreshToken(
      user.id,
      user.tenantId,
      newRefreshToken,
      userAgent,
    );

    // Log token refresh
    await this.auditService.logRefreshToken(user.id, user.tenantId, ip, userAgent);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
      },
    };
  }

  /**
   * Logout and revoke refresh token
   */
  async logout(refreshToken: string, ip?: string, userAgent?: string): Promise<{ message: string }> {
    if (!refreshToken) {
      return { message: 'Logged out successfully' };
    }

    try {
      // Verify and get token data
      const result = await this.tokenService.verifyStoredRefreshToken(refreshToken);
      
      // Revoke the token
      await this.tokenService.revokeRefreshToken(result.storedToken.id);

      // Log logout
      await this.auditService.logLogout(
        result.payload.sub,
        result.storedToken.tenantId,
        ip,
        userAgent,
      );
    } catch (error) {
      // Even if token is invalid, we consider logout successful
      console.error('Logout error:', error.message);
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Revoke all tokens for a user (useful for password change, security breach)
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }

  /**
   * Validate user and return user data (for guards)
   * When `impersonation` claim is present (plan #3), skip strict tenant-match check
   */
  async validateUser(userId: string, tenantId: string, impersonation?: { by: string; tenant: string; at: string }): Promise<any> {
    const where: any = {
      id: userId,
      isActive: true,
    };

    if (impersonation) {
      // Impersonation: user must exist and be active, but tenantId in token
      // is the *target* tenant (not the user's home tenant)
      where.id = userId;
    } else {
      where.tenantId = tenantId;
    }

    const user = await this.prisma.user.findFirst({
      where,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        tenantId: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  /**
   * Request password reset - sends reset token via email/SMS
   * Always returns success to prevent user enumeration
   */
  async forgotPassword(dto: ForgotPasswordDto, ip?: string, userAgent?: string): Promise<{ message: string }> {
    // Validate that email OR phone is provided
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    // Find user by email or phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.phone ? { phone: dto.phone } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
    });

    // Always return success to prevent user enumeration
    // But only send email if user exists and has email
    if (user && user.email) {
      // Revoke any existing unused reset tokens for this user
      await this.tokenService.revokeAllUserResetTokens(user.id);

      // Generate new reset token
      const resetToken = this.tokenService.generateResetToken();
      await this.tokenService.storeResetToken(user.id, user.tenantId, resetToken);

      // TODO: Send email with reset token
      // For now, log it (in production, send via email service)
      console.log(`Password reset token for ${user.email}: ${resetToken}`);

      // Log audit
      await this.auditService.logPasswordResetRequested(user.id, user.tenantId, ip, userAgent);
    }

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  /**
   * Reset password using token
   */
  async resetPassword(dto: ResetPasswordDto, ip?: string, userAgent?: string): Promise<{ message: string }> {
    // Verify reset token
    let storedToken: any;
    try {
      const result = await this.tokenService.verifyResetToken(dto.token);
      storedToken = result.storedToken;
    } catch (error) {
      await this.auditService.logPasswordResetFailed(storedToken?.userId || 'unknown', storedToken?.tenantId || 'unknown', ip, userAgent);
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // Check password history (pass plain password)
    await this.checkPasswordHistory(storedToken.userId, dto.password);

    // Update user password
    await this.prisma.user.update({
      where: { id: storedToken.userId },
      data: { password: passwordHash },
    });

    // Store OLD password in history (current user password before reset)
    await this.storePasswordHistory(storedToken.userId, storedToken.tenantId, storedToken.user?.password || '');

    // Mark reset token as used
    await this.tokenService.markResetTokenUsed(storedToken.id);

    // Revoke all refresh tokens (force re-login)
    await this.tokenService.revokeAllUserTokens(storedToken.userId);

    // Log audit
    await this.auditService.logPasswordResetCompleted(storedToken.userId, storedToken.tenantId, ip, userAgent);

    return { message: 'Password has been reset successfully. Please log in with your new password.' };
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(userId: string, dto: ChangePasswordDto, ip?: string, userAgent?: string): Promise<{ message: string }> {
    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    // Check password history (pass plain password)
    await this.checkPasswordHistory(userId, dto.newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });

    // Store OLD password in history
    await this.storePasswordHistory(userId, user.tenantId, user.password);

    // Revoke all refresh tokens (force re-login on all devices)
    await this.tokenService.revokeAllUserTokens(userId);

    // Log audit
    await this.auditService.logPasswordChange(userId, user.tenantId, ip, userAgent);

    return { message: 'Password changed successfully. Please log in with your new password.' };
  }
}
