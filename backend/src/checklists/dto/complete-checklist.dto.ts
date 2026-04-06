import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CompleteChecklistDto {
  @IsString() result!: string;
  @IsOptional() @IsString() observations?: string;
  @IsOptional() @IsBoolean() criticalFailure?: boolean;
}
