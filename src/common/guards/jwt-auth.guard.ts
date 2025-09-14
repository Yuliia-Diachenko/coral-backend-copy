import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context) {
    const req = context.switchToHttp().getRequest();
    const hasBearer = /^Bearer\s+/i.test(req.headers?.authorization || '');
    const cookieToken = req.cookies?.access_token;

    if (!hasBearer && cookieToken) {
      req.headers.authorization = `Bearer ${cookieToken}`;
    }
    if (!hasBearer && !cookieToken) {
      throw new UnauthorizedException('Access token missing');
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }
    return user;
  }
}
