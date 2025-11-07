/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
  Res,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { RoleSelectionService } from './role-selection.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { SelectRoleDto } from './dto/select-role.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.gaurd';
import { UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly roleSelectionService: RoleSelectionService,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { message: 'No token provided' };
    }

    const token = authHeader.replace('Bearer ', '');
    return this.authService.signOut(token);
  }

  // Consider removing this REST endpoint if using OAuth flow
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.googleAuth(googleAuthDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthInit() {
    // This will redirect to Google OAuth
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const googleUser = req.user;

      // Use the role from Google user (which should come from query parameter)
      const role = googleUser.role || UserRole.PATIENT;

      console.log('Callback - Received role:', role); // Debug log

      const { user, isNewUser } =
        await this.googleAuthService.validateGoogleUser(googleUser, role);

      const token = this.googleAuthService.generateJwtToken(user);

      return res.json({
        message: 'Google OAuth successful',
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role, // This should now show the correct role
          isNewUser,
        },
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Google OAuth failed',
        error: error.message,
      });
    }
  }

  @Put('role')
  @UseGuards(JwtAuthGuard)
  async selectRole(@Req() req, @Body() selectRoleDto: SelectRoleDto) {
    return this.roleSelectionService.selectUserRole(
      req.user.sub,
      selectRoleDto.role,
    );
  }

  @Get('role')
  @UseGuards(JwtAuthGuard)
  async getRole(@Req() req) {
    const role = await this.roleSelectionService.getUserRole(req.user.sub);
    return { role };
  }

  @Get('google/patient')
  @UseGuards(GoogleAuthGuard)
  async googleAuthPatient() {
    // Redirects to Google OAuth for patient role
  }

  @Get('google/doctor')
  @UseGuards(GoogleAuthGuard)
  async googleAuthDoctor() {
    // Redirects to Google OAuth for doctor role
  }
}
