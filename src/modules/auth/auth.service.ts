/* eslint-disable @typescript-eslint/require-await */

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { GoogleAuthService } from './google-auth.service'; // Proper import

@Injectable()
export class AuthService {
  private tokenBlacklist = new Set<string>();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService, // Proper injection
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    const { mobile_number, email, name, role, password } = signUpDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ mobile_number }, { email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this mobile number or email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      mobile_number,
      email,
      name,
      role: role || UserRole.PATIENT,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return {
      message: 'User registered successfully',
      user: {
        user_id: user.user_id,
        name: user.name,
        mobile_number: user.mobile_number,
        role: user.role,
      },
    };
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const { mobile_number, password } = signInDto;

    const user = await this.usersRepository.findOne({
      where: { mobile_number },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.user_id,
      mobile_number: user.mobile_number,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        user_id: user.user_id,
        name: user.name,
        mobile_number: user.mobile_number,
        email: user.email,
        role: user.role,
      },
    };
  }

  async signOut(token: string): Promise<{ message: string }> {
    this.tokenBlacklist.add(token);
    return { message: 'Signed out successfully' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  async googleAuth(
    googleAuthDto: GoogleAuthDto,
  ): Promise<{ accessToken: string; user: any; isNewUser: boolean }> {
    // Consider removing this method if using OAuth flow instead of REST
    const mockGoogleUser = {
      email: 'google.user@example.com',
      firstName: 'Google',
      lastName: 'User',
      googleId: 'google_mock_id_123',
    };

    const { user, isNewUser } = await this.googleAuthService.validateGoogleUser(
      mockGoogleUser,
      googleAuthDto.role,
    );

    const accessToken = this.googleAuthService.generateJwtToken(user);

    return {
      accessToken,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        is_verified: user.is_verified,
      },
      isNewUser,
    };
  }
}
