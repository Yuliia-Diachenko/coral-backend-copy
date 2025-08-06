import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const notificationsServiceMock = {
    create: jest
      .fn()
      .mockResolvedValue({ id: '1', message: 'Test notification' }),
    findAll: jest
      .fn()
      .mockResolvedValue([{ id: '1', message: 'Test notification' }]),
    findOne: jest
      .fn()
      .mockResolvedValue({ id: '1', message: 'Test notification' }),
    markAsRead: jest.fn().mockResolvedValue({ id: '1', read: true }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: notificationsServiceMock,
        },
      ],
    }).compile();
    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
