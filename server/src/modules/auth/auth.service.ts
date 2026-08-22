import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { TokenService } from './services/token.service';
import { AuditService } from './services/audit.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private auditService: AuditService,
  ) {}

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

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await this.auditService.logLoginFailed(user.id, user.tenantId, ip, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

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
    });

    // Store refresh token hash in database
    await this.tokenService.storeRefreshToken(
      user.id,
      user.tenantId,
      refreshToken,
      userAgent,
    );

    // Log successful login
    await this.auditService.logLoginSuccess(user.id, user.tenantId, ip, userAgent);

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
  async refresh(refreshToken: string, ip?: string, userAgent?: string): Promise<AuthResponse> {
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
    });

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
   */
  async validateUser(userId: string, tenantId: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: tenantId,
        isActive: true,
      },
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
}
