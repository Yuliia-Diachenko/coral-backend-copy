import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecaptchaService } from '../common/recaptcha/recaptcha.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly recaptchaService: RecaptchaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const recaptchaToken = request.body?.recaptchaToken;

    if (!recaptchaToken) {
      throw new UnauthorizedException('reCAPTCHA token is missing');
    }

    try {
      await this.recaptchaService.validate(recaptchaToken);
    } catch (error) {
      console.error('Recaptcha validation failed:', error);
      throw new ForbiddenException('Invalid reCAPTCHA token');
    }

    const can = (await super.canActivate(context)) as boolean;

    if (!can) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return can;
  }
}
