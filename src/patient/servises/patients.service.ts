import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import * as bcrypt from 'bcryptjs';
import { PostmarkService } from '../../postmark/postmark.service';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private postmark: PostmarkService,
  ) {}

  async createPatient(dto: CreatePatientDto) {
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const patient = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        discount: dto.discount,
        role: 'PATIENT',
        password: hashedPassword,
      },
    });

    await this.postmark.sendPatientInvite(dto.email, tempPassword);

    return { id: patient.id, email: patient.email };
  }
}
