import { Module } from '@nestjs/common';
import { PatientsService } from './servises/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PostmarkService } from '../postmark/postmark.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PrismaService, PostmarkService],
})
export class PatientsModule {}
