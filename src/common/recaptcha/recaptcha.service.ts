import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecaptchaService {
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET');
    console.log('Using reCAPTCHA secret:', this.secretKey);
  }

  async validate(token: string): Promise<boolean> {
    if (!token) {
      throw new UnauthorizedException('reCAPTCHA token missing');
    }

    try {
      const url = `https://www.google.com/recaptcha/api/siteverify`;
      const params = new URLSearchParams();
      params.append('secret', this.secretKey);
      params.append('response', token);

      const { data } = await firstValueFrom(this.httpService.post(url, params));
      console.log('recaptcha response data:', data);

      if (!data.success) {
        throw new UnauthorizedException('reCAPTCHA validation failed');
      }

      return true;
    } catch (err) {
      console.error('reCAPTCHA verification error:', err);
      throw new UnauthorizedException('Failed to verify reCAPTCHA');
    }
  }
}
