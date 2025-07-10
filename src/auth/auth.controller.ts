import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RecaptchaService } from '../recaptcha/recaptcha.service';

class LoginDto {
  email: string;
  password: string;
  recaptchaToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: LoginDto, @Req() req) {
    const { recaptchaToken } = body;

    // Captcha check before login logic
    await this.recaptchaService.validate(recaptchaToken);

    const user = req.user;

    if (user.role !== 'PROVIDER') {
      throw new UnauthorizedException('Access is allowed only to providers');
    }

    return this.authService.login(user);
  }
}
