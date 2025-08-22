import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // Перевірка логіну
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect password');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async loginWithRefresh(user: any) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, role: user.role },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '30d' },
    );

    // Upsert refresh token at database
    await this.prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: refreshToken },
      create: { userId: user.id, token: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  // Renew access token & refresh token
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload: any = this.jwtService.verify(refreshToken);
      const stored = await this.prisma.refreshToken.findUnique({
        where: { userId: payload.sub },
      });

      if (!stored || stored.token !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { message: 'Logged out successfully' };
  }

  // === reset password ===
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: expires,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Password reset link:', resetLink);
    }

    await this.mailService.sendPasswordResetEmail(email, resetLink);
  }

  async resetPassword(token: string, newPassword: string) {
    const reset = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!reset || reset.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: reset.userId },
      data: { password: hashed },
    });

    await this.prisma.passwordResetToken.delete({ where: { token } });
  }
}
