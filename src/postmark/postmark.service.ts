import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';

@Injectable()
export class PostmarkService {
  private client: postmark.ServerClient;

  constructor() {
    this.client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  }

  async sendPatientInvite(email: string, tempPassword: string) {
    await this.client.sendEmail({
      From: 'admin@pearlgpo.com',
      To: email,
      Subject: 'Welcome to Coral!',
      TextBody: `Your account has been created. 
Email: ${email}
Temporary Password: ${tempPassword}

Please log in and reset your password.`,
    });
  }
}
