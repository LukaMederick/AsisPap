import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PermissionRequestStatus } from '../../database/entities/permission-request.entity';

export class CreatePermissionRequestDto {
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @IsOptional()
  @Transform(({ value }) => (value === null || value === undefined ? null : Number(value)))
  @IsNumber()
  officeId?: number | null;

  @Type(() => Number)
  @IsNumber()
  permissionTypeId!: number;

  @IsDateString()
  requestDate!: string;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PermissionRequestStatus)
  status?: PermissionRequestStatus;
}
