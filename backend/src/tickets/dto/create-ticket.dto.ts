import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString() number!: string;
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() requester!: string;
  @IsString() sectorId!: string;
  @IsString() unitId!: string;
  @IsString() category!: string;
  @IsString() priority!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  @IsOptional() @IsString() status?: 'OPEN' | 'IN_PROGRESS' | 'WAITING_USER' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  @IsOptional() @IsString() technicianId?: string;
  @IsDateString() slaDeadline!: string;
}
