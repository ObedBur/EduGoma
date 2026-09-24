import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { env } from '../../config/env';
import { AuthService } from './auth.service';
import { Public } from './decorators/auth.decorators';
import { CurrentUserId } from './decorators/user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetupPasswordDto } from './dto/setup-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: env.AUTH_REGISTER_LIMIT, ttl: env.AUTH_REGISTER_TTL } })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const user = await this.authService.register(dto, ip, userAgent);

    return {
      success: true,
      message: 'User registered successfully',
      data: { user },
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: env.AUTH_LOGIN_LIMIT, ttl: env.AUTH_LOGIN_TTL } })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const { accessToken, refreshToken, user } = await this.authService.login(dto, ip, userAgent);

    // Stockage du token de rafraîchissement en cookie HTTP-only
    const isProd = env.NODE_ENV === 'production';
    const rememberMe = dto.rememberMe === true;
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge,
      path: '/',
    });

    return {
      success: true,
      message: 'Login successful',
      data: { accessToken, user },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto?: RefreshDto,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';
    const refreshToken = req.cookies?.refreshToken ?? dto?.refreshToken;
    const rememberMe = dto?.rememberMe === true;

    const { accessToken, refreshToken: newRefreshToken, user } = await this.authService.refresh(refreshToken, ip, userAgent, rememberMe);

    const isProd = env.NODE_ENV === 'production';
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge,
      path: '/',
    });

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken, user },
    };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';
    const refreshToken = req.cookies?.refreshToken;

    await this.authService.logout(refreshToken, ip, userAgent);

    const isProd = env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @CurrentUserId() userId: string,
    @Req() req: Request,
  ) {
    const user = req.user;
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        roles: user.userRoles?.map((ur: any) => ur.role.name) ?? [],
      },
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: env.AUTH_FORGOT_PASSWORD_LIMIT, ttl: env.AUTH_FORGOT_PASSWORD_TTL } })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.authService.forgotPassword(dto, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: env.AUTH_RESET_PASSWORD_LIMIT, ttl: env.AUTH_RESET_PASSWORD_TTL } })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.authService.resetPassword(dto, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: env.AUTH_CHANGE_PASSWORD_LIMIT, ttl: env.AUTH_CHANGE_PASSWORD_TTL } })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUserId() userId: string,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.authService.changePassword(userId, dto, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }

  @Public()
  @Get('setup/:token')
  @HttpCode(HttpStatus.OK)
  async getSetupInfo(@Param('token') token: string) {
    const data = await this.authService.getSetupInfo(token);
    return {
      success: true,
      data,
    };
  }

  @Public()
  @Post('setup/:token')
  @HttpCode(HttpStatus.OK)
  async completeSetup(
    @Param('token') token: string,
    @Body() dto: SetupPasswordDto,
    @Req() req: Request,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const result = await this.authService.completeSetup(token, dto, ip, userAgent);

    return {
      success: true,
      ...result,
    };
  }
}
