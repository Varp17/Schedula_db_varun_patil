import {
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsMobilePhone(
    'en-IN',
    {},
    { message: 'Mobile number must be a valid Indian phone number' },
  )
  mobile_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
