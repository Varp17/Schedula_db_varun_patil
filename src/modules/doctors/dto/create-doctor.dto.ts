import { IsString, IsOptional, IsInt, IsNumber, Min } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsString()
  specialization: string;

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsInt()
  experience?: number;

  @IsOptional()
  @IsString()
  clinic_address?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  consultation_fee?: number;
}
