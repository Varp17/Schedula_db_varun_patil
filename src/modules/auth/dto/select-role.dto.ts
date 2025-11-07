import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class SelectRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
