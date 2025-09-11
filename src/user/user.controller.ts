import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BackendApiGuard } from '../common/guards/backend-api.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.PROVIDER) // Only ADMIN and PROVIDER allowed
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto, @Request() req) {
    return this.userService.create(dto, req.user.role);
  }

  @Get()
  findAll(@Query() filter: UserFilterDto, @Request() req) {
    return this.userService.findAll(filter, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.userService.findOne(id, req.user.role);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req) {
    return this.userService.update(id, dto, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.userService.remove(id, req.user.role);
  }
}
@Controller('internal/users')
@UseGuards(BackendApiGuard)
export class InternalUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllInternal(@Query() filter: UserFilterDto) {
    return this.userService.findAll(filter, 'ADMIN');
  }

  @Post()
  async createInternal(@Body() dto: CreateUserDto) {
    return this.userService.create(dto, 'ADMIN');
  }
}
