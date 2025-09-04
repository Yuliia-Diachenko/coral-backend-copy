import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
