/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  mobile_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
