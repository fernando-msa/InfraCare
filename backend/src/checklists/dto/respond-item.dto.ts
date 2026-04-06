import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RespondItemDto {
  @IsString() executionId!: string;
  @IsString() templateItemId!: string;
  @IsEnum(['COMPLIANT', 'NON_COMPLIANT', 'NOT_APPLICABLE']) result!: 'COMPLIANT' | 'NON_COMPLIANT' | 'NOT_APPLICABLE';
  @IsOptional() @IsString() observation?: string;
  @IsOptional() @IsString() evidenceText?: string;
}
