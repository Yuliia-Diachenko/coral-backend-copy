import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // вказуємо, що логін — це email
  }

  async validate(email: string, password: string) {
    console.log('📩 LocalStrategy validate:', { email, password });

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      console.log('❌ User not found or password mismatch');
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
