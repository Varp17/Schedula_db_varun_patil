import { IsString, IsInt, Min, Max } from 'class-validator';

export class SetAvailabilityDto {
  @IsString()
  day: string;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsInt()
  @Min(1)
  @Max(50)
  max_patients: number;
}
