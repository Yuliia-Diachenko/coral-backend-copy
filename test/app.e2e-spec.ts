import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/mail/mail.service';
import { RecaptchaService } from '../src/common/recaptcha/recaptcha.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // 📨 Мок поштового сервісу
      .overrideProvider(MailService)
      .useValue({
        sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
      })

      // 🔐 Мок reCAPTCHA сервісу
      .overrideProvider(RecaptchaService)
      .useValue({
        validate: jest.fn().mockResolvedValue(true),
      })

      // 🛢 Мок бази даних
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findUnique: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
        },
        // додай інші сутності при потребі
      })

      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
