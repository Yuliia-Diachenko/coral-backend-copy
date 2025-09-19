import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InternalUserController, UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PostmarkModule } from 'src/postmark/postmark.module';

@Module({
  imports: [PostmarkModule, PrismaModule],
  controllers: [UserController, InternalUserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
