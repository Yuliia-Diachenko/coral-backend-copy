import {
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    console.log('🤖 req.user =', req.user);
    const user = req.user;

    if (user.role !== 'PROVIDER') {
      throw new UnauthorizedException('Access is allowed only to providers');
    }

    return this.authService.login(user);
  }
}
