import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }

    request.headers.authorization = `Bearer ${token}`;

    return super.canActivate(context);
  }
}
