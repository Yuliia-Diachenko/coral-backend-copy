import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PostmarkService } from '../postmark/postmark.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PostmarkModule } from '../postmark/postmark.module';

@Module({
  imports: [PrismaModule, PostmarkModule],
  controllers: [PatientsController],
  providers: [PatientsService, PrismaService, PostmarkService],
  exports: [PatientsService],
})
export class PatientsModule {}
