import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import * as bcrypt from 'bcryptjs';
import { PostmarkService } from 'src/postmark/postmark.service';
import * as XLSX from 'xlsx';
// import { Prisma, Role } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private postmark: PostmarkService,
  ) {}

  /**
   * Create a single patient in the database
   */
  async createPatient(dto: CreatePatientDto) {
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const patient = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        // phone: dto.phone,
        // dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        // gender: dto.gender,
        // discount: dto.discount,
        role: 'PATIENT',
        password: hashedPassword,
      },
    });

    if (dto.inviteOption === 'invite') {
      await this.postmark.sendPatientInvite(dto.email, tempPassword);
    }

    return { id: patient.id, email: patient.email };
  }

  /**
   * Import patients from uploaded Excel (.xlsx) file
   */
  async importPatients(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Reading Excel file
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Converting a letter to JSON
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

      const results = [];

      for (const row of rows) {
        const dto: CreatePatientDto = {
          email: row.email,
          firstName: row.firstName || null,
          lastName: row.lastName || null,
          phone: row.phoneNumber || null,
          inviteOption: 'invite',
        };

        try {
          const created = await this.createPatient(dto);
          results.push({ email: dto.email, status: 'created', id: created.id });
        } catch (err) {
          results.push({
            email: dto.email,
            status: 'error',
            error: err.message,
          });
        }
      }

      return {
        imported: results.length,
        results,
      };
    } catch (err) {
      throw new BadRequestException(
        `Failed to parse Excel file: ${err.message}`,
      );
    }
  }

  // async listPatients(params: {
  //   name?: string;
  //   page?: number;
  //   pageSize?: number;
  // }) {
  //   const { name, page = 1, pageSize = 20 } = params;

  //   const where: Prisma.UserWhereInput = {
  //     role: Role.PATIENT,
  //   };

  //   if (name && name.trim()) {
  //     where.OR = [
  //       { firstName: { contains: name, mode: Prisma.QueryMode.insensitive } },
  //       { lastName: { contains: name, mode: Prisma.QueryMode.insensitive } },
  //       { email: { contains: name, mode: Prisma.QueryMode.insensitive } },
  //       // { phone: { contains: name, mode: Prisma.QueryMode.insensitive } },
  //     ];
  //   }

  //   const [items, total] = await this.prisma.$transaction([
  //     this.prisma.user.findMany({
  //       where,
  //       orderBy: { createdAt: 'desc' },
  //       skip: (page - 1) * pageSize,
  //       take: pageSize,
  //       select: {
  //         id: true,
  //         firstName: true,
  //         lastName: true,
  //         email: true,
  //         // phone: true,
  //       },
  //     }),
  //     this.prisma.user.count({ where }),
  //   ]);

  //   return { items, total, page, pageSize };
  // }
}
