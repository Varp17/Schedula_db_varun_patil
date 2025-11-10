import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { VerificationToken } from './entities/verification-token.entity';
import { DoctorAvailability } from './entities/availability.entity';
import { User } from '../users/entities/user.entity'; // ✅ Remove unused UserRole
import { CreateDoctorProfileDto } from './dto/create-doctor.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { randomInt } from 'crypto';
import { Slot } from './entities/slot.entity';
import { TimeSlot } from './entities/time-slot.entity';

@Injectable()
export class DoctorsService {
  private readonly logger = new Logger(DoctorsService.name);
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(VerificationToken)
    private tokenRepository: Repository<VerificationToken>,
    @InjectRepository(DoctorAvailability)
    private availabilityRepository: Repository<DoctorAvailability>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Slot) // ADD this
    private slotRepository: Repository<Slot>,
    @InjectRepository(TimeSlot) // ADD this
    private timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async createProfile(
    userId: number,
    dto: CreateDoctorProfileDto,
  ): Promise<Doctor> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    let doctor = await this.doctorRepository.findOne({
      where: { user: { user_id: userId } },
      relations: ['user'], // ✅ Add relations to check existing profile
    });

    if (doctor) {
      // Update existing profile
      await this.doctorRepository.update(doctor.doctor_id, dto);
      return this.doctorRepository.findOne({
        where: { doctor_id: doctor.doctor_id },
        relations: ['user'], // ✅ Include user in response
      });
    } else {
      // Create new profile
      doctor = this.doctorRepository.create({
        ...dto,
        user,
      });
      const savedDoctor = await this.doctorRepository.save(doctor);

      // ✅ Return with user relation
      return this.doctorRepository.findOne({
        where: { doctor_id: savedDoctor.doctor_id },
        relations: ['user'],
      });
    }
  }

  async getProfile(userId: number): Promise<Doctor> {
    return await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.availability', 'availability')
      .where('user.user_id = :userId', { userId })
      .getOne();
  }

  async generateOTP(
    doctorId: number,
  ): Promise<{ message: string; otp: string }> {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: doctorId },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    // Generate 6-digit OTP
    const otp = randomInt(100000, 999999).toString();

    // Save OTP to database
    const token = this.tokenRepository.create({
      doctor,
      otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await this.tokenRepository.save(token);

    return {
      message: 'OTP generated successfully. For demo purposes, use this OTP:',
      otp,
    };
  }

  async verifyOTP(doctorId: number, otp: string): Promise<{ message: string }> {
    const token = await this.tokenRepository.findOne({
      where: {
        doctor: { doctor_id: doctorId },
        otp,
        is_used: false,
      },
      relations: ['doctor'],
    });

    if (!token) throw new BadRequestException('Invalid or expired OTP');
    if (new Date() > token.expires_at)
      throw new BadRequestException('OTP has expired');

    // Mark OTP as used
    token.is_used = true;
    await this.tokenRepository.save(token);

    // Verify doctor
    token.doctor.is_verified = true;
    await this.doctorRepository.save(token.doctor);

    return { message: 'Doctor verified successfully!' };
  }

  async setAvailability(
    userId: number,
    dto: SetAvailabilityDto,
  ): Promise<DoctorAvailability> {
    console.log('🔍 Setting availability for user:', userId);
    console.log('🔍 Availability DTO:', dto);

    // Get doctor with proper relation
    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .where('user.user_id = :userId', { userId })
      .getOne();

    console.log('🔍 Found doctor:', doctor);

    if (!doctor) throw new NotFoundException('Doctor profile not found');

    // Create availability with the doctor
    const availability = this.availabilityRepository.create({
      day: dto.day,
      start_time: dto.start_time,
      end_time: dto.end_time,
      max_patients: dto.max_patients,
      doctor: doctor, // ✅ Direct assignment
    });

    console.log('🔍 Created availability object:', availability);

    try {
      const savedAvailability =
        await this.availabilityRepository.save(availability);
      console.log('🔍 Saved availability:', savedAvailability);

      // Return the saved availability with relations
      const result = await this.availabilityRepository.findOne({
        where: { id: savedAvailability.id },
        relations: ['doctor'],
      });

      console.log('🔍 Final result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error saving availability:', error);
      throw error;
    }
  }

  async getAvailability(userId: number): Promise<DoctorAvailability[]> {
    console.log('🔍 Getting availability for user:', userId);

    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .where('user.user_id = :userId', { userId })
      .getOne();

    console.log('🔍 Found doctor for availability:', doctor);

    if (!doctor) throw new NotFoundException('Doctor profile not found');

    const availability = await this.availabilityRepository.find({
      where: { doctor: { doctor_id: doctor.doctor_id } },
      relations: ['doctor'],
    });

    console.log('🔍 Found availability records:', availability);
    return availability;
  }
  async findById(id: number): Promise<Doctor> {
    return this.doctorRepository.findOne({
      where: { doctor_id: id },
      relations: ['user', 'slots', 'timeSlots'],
    });
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({
      relations: ['user', 'slots', 'timeSlots'],
      where: { is_verified: true },
    });
  }

  // New method for Week 2 slot management
  async createSlots(
    doctorId: number,
    slotsData: { date: string; start_time: string; end_time: string }[],
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const slotEntities = slotsData.map((slotData) => {
      const slot = new Slot();
      slot.date = slotData.date;
      slot.start_time = slotData.start_time;
      slot.end_time = slotData.end_time;
      slot.doctor = doctor;
      slot.is_booked = false;
      return slot;
    });

    return this.slotRepository.save(slotEntities);
  }
}
