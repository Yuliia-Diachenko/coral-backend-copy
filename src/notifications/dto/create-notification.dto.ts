import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';

export enum NotificationType {
  GENERAL = 'GENERAL',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export class CreateNotificationDto {
  @IsString()
  message: string;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType = NotificationType.GENERAL;

  @IsUUID()
  userId: string;
}
