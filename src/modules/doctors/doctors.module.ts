import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from './entities/doctor.entity';
import { VerificationToken } from './entities/verification-token.entity';
import { DoctorAvailability } from './entities/availability.entity';
import { User } from '../users/entities/user.entity';
import { AvailabilityModule } from './availability/availability.module';
// ADD THESE IMPORTS:
import { Slot } from './entities/slot.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctor,
      VerificationToken,
      DoctorAvailability,
      User,
      Slot,
      TimeSlot,
      Appointment,
    ]),
    AvailabilityModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
