import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientsService } from '../servises/patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../../auth/roles.guard';

@Controller('patients')
@UseGuards(RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROVIDER)
  async create(@Body() dto: CreatePatientDto) {
    return this.patientsService.createPatient(dto);
  }

  // csv template download
  @Get('template')
  @Roles(Role.ADMIN, Role.PROVIDER)
  async downloadTemplate(@Res() res: Response) {
    const header = 'email,firstName,lastName,phoneNumber\n';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="patients_template.csv"',
    );
    res.send(header);
  }

  // import from CSV
  @Post('import')
  @Roles(Role.ADMIN, Role.PROVIDER)
  @UseInterceptors(FileInterceptor('file'))
  async importPatients(@UploadedFile() file: Express.Multer.File) {
    return this.patientsService.importPatients(file);
  }
}
