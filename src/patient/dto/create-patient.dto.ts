import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // @IsOptional()
  // dateOfBirth?: string;

  // @IsOptional()
  // gender?: string;

  @IsOptional()
  discount?: number;
  inviteOption?: 'invite' | 'noEmail';
}
