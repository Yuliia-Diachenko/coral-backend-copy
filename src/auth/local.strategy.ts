import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
    this.logger = new Logger('LocalStrategy LOGGER');
  }

  async validate(email: string, password: string) {
    this.logger.log('📩 LocalStrategy validate:', { email, password });
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      this.logger.error('❌ User not found or password mismatch');
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
