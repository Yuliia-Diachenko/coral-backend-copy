import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostmarkService } from '../postmark/postmark.service';

describe('UserService', () => {
  let service: UserService;
  const mockPostmarkService = {
    sendPatientInvite: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService, // ensure PrismaService is provided
        { provide: PostmarkService, useValue: mockPostmarkService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
