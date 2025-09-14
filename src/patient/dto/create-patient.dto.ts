import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreatePatientDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  discount?: number;

  @IsOptional()
  @IsEnum(['invite', 'noEmail'], {
    message: 'inviteOption must be either "invite" or "noEmail"',
  })
  inviteOption?: 'invite' | 'noEmail';
}
