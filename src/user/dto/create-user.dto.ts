import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Role, Status } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  // Role is optional and should be set only by ADMIN
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
