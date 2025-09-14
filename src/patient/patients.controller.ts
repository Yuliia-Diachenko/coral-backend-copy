import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  // Query,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('patients')
@UseGuards(RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // @Get()
  // @Roles(Role.ADMIN, Role.PROVIDER)
  // async list(
  //   @Query('name') name?: string,
  //   @Query('page') page = '1',
  //   @Query('pageSize') pageSize = '20',
  // ) {
  //   return this.patientsService.listPatients({
  //     name,
  //     page: Number(page) || 1,
  //     pageSize: Number(pageSize) || 20,
  //   });
  // }

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
