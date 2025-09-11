import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggingModule } from './logging/logging.module';
import { PostmarkModule } from './postmark/postmark.module';
import { PatientsModule } from './patient/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    AuthModule,
    NotificationsModule,
    LoggingModule,
    PostmarkModule,
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [MailService],
})
export class AppModule {}
