import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;

    if (!['PROVIDER', 'ADMIN', 'PATIENT'].includes(user.role)) {
      throw new UnauthorizedException(
        'Access is allowed only to providers, admins or patients',
      );
    }

    // Генеруємо access + refresh токени
    const { accessToken, refreshToken } =
      await this.authService.loginWithRefresh(user);

    // Встановлюємо HttpOnly cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: '.coralscript.com',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 хвилин
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: '.coralscript.com',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    return { role: user.role };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    const newAccessToken =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: '.coralscript.com',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return { message: 'Access token refreshed' };
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    await this.authService.requestPasswordReset(dto.email);
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password has been reset successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }
}
