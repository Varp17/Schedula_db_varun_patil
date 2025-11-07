import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class GoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsEnum(UserRole)
  role: UserRole;
}
