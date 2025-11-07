import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createPatient(
    userId: number,
    createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingPatient = await this.patientsRepository.findOne({
      where: { user_id: userId },
    });
    if (existingPatient) {
      throw new ConflictException('Patient profile already exists');
    }

    const patient = this.patientsRepository.create({
      ...createPatientDto,
      user_id: userId,
    });

    return this.patientsRepository.save(patient);
  }

  async getPatientProfile(userId: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return patient;
  }
}
