import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class RoleSelectionService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async selectUserRole(userId: number, role: UserRole): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has a role set
    if (user.role !== UserRole.PATIENT) {
      throw new ConflictException('User role already selected');
    }

    user.role = role;
    return this.usersRepository.save(user);
  }

  async getUserRole(userId: number): Promise<UserRole> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.role;
  }
}
