import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import * as crypto from 'crypto';
import { jwtSign, jwtSignRefresh, jwtVerify, jwtVerifyRefresh } from '../../../libs/jwt.lib';
import { env } from '../../../config/env';

export interface TokenPayload {
  sub: string;
  tenantId: string;
  email?: string;
  phone?: string;
}

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate short-lived access token (15 minutes)
   */
  generateAccessToken(payload: TokenPayload): string {
    return jwtSign(
      { 
        sub: payload.sub, 
        tenantId: payload.tenantId,
        email: payload.email,
        phone: payload.phone,
      },
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
    );
  }

  /**
   * Generate long-lived refresh token (7 days)
   */
  generateRefreshToken(payload: TokenPayload): string {
    return jwtSignRefresh(
      { 
        sub: payload.sub, 
        tenantId: payload.tenantId,
        type: 'refresh',
      },
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): any {
    try {
      return jwtVerify(token);
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): any {
    try {
      return jwtVerifyRefresh(token);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Hash refresh token before storing in database
   * Uses SHA256 for deterministic hashing (required for lookups)
   */
  async hashRefreshToken(token: string): Promise<string> {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  /**
   * Store refresh token hash in database
   */
  async storeRefreshToken(
    userId: string,
    tenantId: string,
    token: string,
    userAgent?: string
  ): Promise<string> {
    const tokenHash = await this.hashRefreshToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        userId,
        tenantId,
        tokenHash,
        userAgent,
        expiresAt,
      },
    });

    return refreshToken.id;
  }

  /**
   * Verify refresh token against database
   */
  async verifyStoredRefreshToken(token: string): Promise<any> {
    // First verify JWT signature
    const payload = this.verifyRefreshToken(token);

    // Hash the token to compare with database
    const tokenHash = await this.hashRefreshToken(token);

    // Find token in database
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    if (storedToken.isRevoked) {
      throw new Error('Refresh token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token has expired');
    }

    return { payload, storedToken };
  }

  /**
   * Revoke a specific refresh token
   */
  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { isRevoked: true },
    });
  }

  /**
   * Revoke refresh token by hash
   */
  async revokeRefreshTokenByHash(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  /**
   * Clean up expired tokens (can be run as a cron job)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isRevoked: true, createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Revoked tokens older than 30 days
        ],
      },
    });

    return result.count;
  }
}
