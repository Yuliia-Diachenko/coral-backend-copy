import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'podolyak365@gmail.com', password: 'test1234' });
    console.log('Login response status:', loginResponse.status);
    console.log('Login response body:', loginResponse.body);
    jwtToken = loginResponse.body.accessToken;
  });

  it('/auth/logout (POST) - повертає успішний статус', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Logged out successfully' });
  });

  afterAll(async () => {
    await app.close();
  });
});
