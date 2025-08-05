import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { RecaptchaModule } from '../common/recaptcha/recaptcha.module';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    PrismaModule,
    RecaptchaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    MailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
