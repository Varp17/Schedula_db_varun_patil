import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorProfileDto } from './dto/create-doctor.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Doctor } from './entities/doctor.entity';

interface AuthenticatedRequest extends Request {
  user: {
    user_id?: number;
    sub?: number;
    email: string;
    role: string;
  };
}

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {} // FIX: Remove duplicate doctorService

  private getUserId(req: AuthenticatedRequest): number {
    console.log('🔍 JWT User object:', req.user); // DEBUG
    console.log('🔍 JWT sub:', req.user.sub); // DEBUG
    console.log('🔍 JWT user_id:', req.user.user_id); // DEBUG

    // ✅ Priority: user_id first, then sub
    const userId = req.user.user_id || req.user.sub;
    console.log('🔍 Extracted User ID:', userId); // DEBUG

    if (!userId) {
      throw new Error('User ID not found in JWT token');
    }

    return userId;
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateDoctorProfileDto,
  ) {
    const userId = this.getUserId(req);
    console.log('🎯 Creating profile for user ID:', userId); // DEBUG
    return this.doctorsService.createProfile(userId, dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest) {
    const userId = this.getUserId(req);
    console.log('🎯 Getting profile for user ID:', userId); // DEBUG
    return this.doctorsService.getProfile(userId);
  }

  @Post('generate-otp')
  @UseGuards(JwtAuthGuard)
  async generateOTP(@Request() req: AuthenticatedRequest) {
    const userId = this.getUserId(req);
    console.log('🎯 Generating OTP for user ID:', userId); // DEBUG
    const doctor = await this.doctorsService.getProfile(userId);
    return this.doctorsService.generateOTP(doctor.doctor_id);
  }

  @Post('verify-otp')
  @UseGuards(JwtAuthGuard)
  async verifyOTP(
    @Request() req: AuthenticatedRequest,
    @Body() dto: VerifyOtpDto,
  ) {
    const userId = this.getUserId(req);
    console.log('🎯 Verifying OTP for user ID:', userId); // DEBUG
    const doctor = await this.doctorsService.getProfile(userId);
    return this.doctorsService.verifyOTP(doctor.doctor_id, dto.otp);
  }

  @Post('availability')
  @UseGuards(JwtAuthGuard)
  async setAvailability(
    @Request() req: AuthenticatedRequest,
    @Body() dto: SetAvailabilityDto,
  ) {
    const userId = this.getUserId(req);
    console.log('🎯 Setting availability for user ID:', userId); // DEBUG
    return this.doctorsService.setAvailability(userId, dto);
  }

  @Get('availability')
  @UseGuards(JwtAuthGuard)
  async getAvailability(@Request() req: AuthenticatedRequest) {
    const userId = this.getUserId(req);
    console.log('🎯 Getting availability for user ID:', userId); // DEBUG
    return this.doctorsService.getAvailability(userId);
  }

  // PUBLIC ENDPOINTS - No JWT guard for patients to view doctors
  @Get()
  async getAllDoctors(): Promise<Doctor[]> {
    return await this.doctorsService.findAll(); // FIX: Use doctorsService (not doctorService)
  }

  @Get(':id')
  async getDoctor(@Param('id') id: number): Promise<Doctor> {
    return await this.doctorsService.findById(id); // FIX: Use doctorsService (not doctorService)
  }
}
