import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RecaptchaService } from '../common/recaptcha/recaptcha.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockRecaptchaService = {
    validate: jest.fn().mockResolvedValue(true),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        {
          provide: RecaptchaService,
          useValue: mockRecaptchaService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
