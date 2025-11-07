import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, AuthProvider } from '../users/entities/user.entity';

// Define proper TypeScript interfaces for Google user
interface GoogleUserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  googleId: string;
}

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(
    googleUser: GoogleUserProfile, // Use typed parameter
    role: UserRole,
  ): Promise<{ user: User; isNewUser: boolean }> {
    const { email, firstName, lastName, fullName, googleId } = googleUser;

    // Safe name formatting with proper type checking
    const userName = this.formatUserName(fullName, firstName, lastName, email);

    // Check if user exists with this Google ID
    let user = await this.usersRepository.findOne({
      where: { google_id: googleId },
    });

    let isNewUser = false;

    if (user) {
      // Update user information if needed
      if (user.email !== email || user.name !== userName) {
        user.email = email;
        user.name = userName;
        user = await this.usersRepository.save(user);
      }
    } else {
      // Check if user exists with email but different provider
      const existingUserByEmail = await this.usersRepository.findOne({
        where: { email },
      });

      if (existingUserByEmail) {
        throw new ConflictException(
          'Email already registered with different provider',
        );
      }

      // Create new user
      isNewUser = true;
      user = this.usersRepository.create({
        email,
        name: userName,
        google_id: googleId,
        provider: AuthProvider.GOOGLE,
        password: null,
        role: role,
        is_verified: true,
        mobile_number: null,
      });

      user = await this.usersRepository.save(user);
    }

    return { user, isNewUser };
  }

  generateJwtToken(user: User): string {
    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };

    return this.jwtService.sign(payload);
  }

  // Helper method for safe name formatting
  private formatUserName(
    fullName?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
  ): string {
    // Use fullName if available
    if (fullName && fullName.trim()) {
      return fullName.trim();
    }

    // Combine first and last name
    const combinedName = `${firstName || ''} ${lastName || ''}`.trim();
    if (combinedName) {
      return combinedName;
    }

    // Fallback to email username
    if (email) {
      return email.split('@')[0] || 'User';
    }

    // Final fallback
    return 'Google User';
  }
}
