import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserFilterDto } from './dto/user-filter.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Create user with role-based restrictions
  async create(data: CreateUserDto, requesterRole: Role) {
    // Providers can create only PATIENT users
    if (
      requesterRole === Role.PROVIDER &&
      data.role &&
      data.role !== Role.PATIENT
    ) {
      throw new ForbiddenException('Providers can only create patients');
    }

    // Providers can't assign role other than PATIENT
    if (requesterRole === Role.PROVIDER) {
      data.role = Role.PATIENT;
    }

    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: { ...data, password: hashed },
    });
  }

  // Find users with filtering and role-based access control
  async findAll(filter: UserFilterDto, requesterRole: Role) {
    const where: Prisma.UserWhereInput = {};

    if (requesterRole === Role.PROVIDER) {
      // Providers can only see patients, ignore role filter if any
      where.role = Role.PATIENT;
    } else if (filter.role) {
      where.role = filter.role;
    }

    if (filter.email) {
      where.email = { contains: filter.email, mode: 'insensitive' };
    }
    if (filter.firstName) {
      where.firstName = { contains: filter.firstName, mode: 'insensitive' };
    }
    if (filter.lastName) {
      where.lastName = { contains: filter.lastName, mode: 'insensitive' };
    }

    return this.prisma.user.findMany({ where });
  }

  async findOne(id: string, requesterRole: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Provider can only access patients
    if (requesterRole === Role.PROVIDER && user.role !== Role.PATIENT) {
      throw new ForbiddenException('Access denied');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto, requesterRole: Role) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    // Providers can only update patients and cannot update role to something else
    if (requesterRole === Role.PROVIDER) {
      if (existing.role !== Role.PATIENT) {
        throw new ForbiddenException('Providers can only update patients');
      }
      if (data.role && data.role !== Role.PATIENT) {
        throw new ForbiddenException('Providers cannot change user role');
      }
    }

    // If password update, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string, requesterRole: Role) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    // Providers can delete only patients
    if (requesterRole === Role.PROVIDER && existing.role !== Role.PATIENT) {
      throw new ForbiddenException('Providers can only delete patients');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
