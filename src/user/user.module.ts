import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InternalUserController, UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, InternalUserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
