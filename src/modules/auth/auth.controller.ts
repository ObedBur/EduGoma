import { Controller, Post, Get, Body, Req, Res, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Public } from './decorators/auth.decorators';
import { CurrentUserId } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress;
    const userAgent = req.get('user-agent') ?? 'unknown';

    const { accessToken, refreshToken, user } = await this.authService.login(dto, ip, userAgent);

    // Stockage du token de rafraîchissement en cookie HTTP-only
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

    const { accessToken, refreshToken: newRefreshToken, user } = await this.authService.refresh(refreshToken, ip, userAgent);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
}
