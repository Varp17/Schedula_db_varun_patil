/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async createPatient(
    @Request() req,
    @Body() createPatientDto: CreatePatientDto,
  ) {
    return this.patientsService.createPatient(req.user.sub, createPatientDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getPatientProfile(@Request() req) {
    return this.patientsService.getPatientProfile(req.user.sub);
  }
}
