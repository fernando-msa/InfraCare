import { IsOptional, IsString } from 'class-validator';

export class CreateIncidentDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() type!: string;
  @IsString() severity!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  @IsString() impact!: string;
  @IsString() origin!: string;
  @IsOptional() @IsString() assetId?: string;
  @IsString() sectorId!: string;
  @IsString() unitId!: string;
  @IsOptional() @IsString() status?: 'OPEN' | 'ANALYSIS' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  @IsOptional() @IsString() responsibleId?: string;
}
