import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssetDto {
  @IsString() name!: string;
  @IsString() type!: string;
  @IsString() category!: string;
  @IsString() hostname!: string;
  @IsString() ip!: string;
  @IsString() location!: string;
  @IsString() unitId!: string;
  @IsString() sectorId!: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(['ONLINE', 'OFFLINE', 'UNSTABLE', 'MAINTENANCE']) currentStatus!: 'ONLINE' | 'OFFLINE' | 'UNSTABLE' | 'MAINTENANCE';
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']) criticality!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  @IsString() monitoringMethod!: string;
  @Type(() => Number) @IsInt() @Min(1) checkIntervalMin!: number;
  @IsOptional() @IsString() observation?: string;
}
