import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecaptchaService } from '../recaptcha/recaptcha.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly recaptchaService: RecaptchaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const recaptchaToken = request.body.recaptchaToken;

    if (!recaptchaToken) {
      throw new UnauthorizedException('reCAPTCHA token is missing');
    }

    await this.recaptchaService.validate(recaptchaToken);

    // Next, we call the original LocalAuthGuard for login
    return super.canActivate(context) as Promise<boolean>;
  }
}
