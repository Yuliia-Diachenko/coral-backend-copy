import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecaptchaService {
  private readonly secretKey: string;
  logger: Logger;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET');
    this.logger = new Logger('RecaptchaService LOGGER');
  }

  async validate(token: string): Promise<boolean> {
    if (!token) throw new UnauthorizedException('reCAPTCHA token missing');

    try {
      const url = 'https://www.google.com/recaptcha/api/siteverify';
      const params = new URLSearchParams();
      params.append('secret', this.secretKey);
      params.append('response', token);
      const { data } = await firstValueFrom(
        this.httpService.post(url, params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 6000,
        }),
      );

      this.logger.log('reCAPTCHA verify payload:', {
        success: data?.success,
        'error-codes': data?.['error-codes'],
        hostname: data?.hostname,
        score: data?.score,
        action: data?.action,
      });

      if (!data?.success || data?.hostname !== 'coralscript.com') {
        throw new UnauthorizedException(
          `reCAPTCHA failed: ${(data?.['error-codes'] || []).join(',') || 'unknown'}`,
        );
      }
      return true;
    } catch (err) {
      this.logger.log('reCAPTCHA verification error:', err?.message || err);
      throw new UnauthorizedException('Failed to verify reCAPTCHA');
    }
  }
}
