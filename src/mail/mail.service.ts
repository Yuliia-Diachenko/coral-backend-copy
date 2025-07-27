import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';

@Injectable()
export class MailService {
  private client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);

  async sendPasswordResetEmail(email: string, resetLink: string) {
    return this.client.sendEmail({
      From: 'admin@pearlgpo.com', //  email at Postmark
      To: email,
      Subject: 'Reset your password',
      TextBody: `Click the link below to reset your password:\n\n${resetLink}`,
    });
  }
}
