import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecaptchaService } from '../common/recaptcha/recaptcha.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  logger: Logger;
  constructor(private readonly recaptchaService: RecaptchaService) {
    super();
    this.logger = new Logger('LocalAuthGuard LOGGER');
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
      this.logger.error(
        'Recaptcha validation failed:',
        error?.message || error,
      );
      throw new ForbiddenException('Invalid reCAPTCHA token');
    }

    try {
      const can = (await super.canActivate(context)) as boolean;
      if (!can) {
        throw new UnauthorizedException('Invalid email or password');
      }
      return can;
    } catch (err) {
      this.logger.error('LocalAuthGuard error:', err?.message || err);
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
