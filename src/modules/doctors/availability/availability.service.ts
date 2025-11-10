/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from '../entities/slot.entity';
import { TimeSlot } from '../entities/time-slot.entity';
import { Doctor } from '../entities/doctor.entity';
import { CreateAvailabilityDto } from '../dto/create-availability.dto';
import { UpdateAvailabilityDto } from '../dto/update-availability.dto';
import { UpdateSlotDto } from '../dto/update-slot.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async setAvailability(
    doctorId: number,
    createAvailabilityDto: CreateAvailabilityDto,
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: doctorId },
      relations: ['user'],
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const { slots, timeSlots } = createAvailabilityDto;

    // Create individual slots
    const slotEntities = slots.map((slotDto) => {
      const slot = new Slot();
      slot.date = slotDto.date;
      slot.start_time = slotDto.start_time;
      slot.end_time = slotDto.end_time;
      slot.doctor = doctor;
      slot.is_booked = slotDto.is_booked || false;
      return slot;
    });

    // Create recurring time slots
    const timeSlotEntities = timeSlots.map((timeSlotDto) => {
      const timeSlot = new TimeSlot();
      timeSlot.day_of_week = timeSlotDto.day_of_week;
      timeSlot.start_time = timeSlotDto.start_time;
      timeSlot.end_time = timeSlotDto.end_time;
      timeSlot.is_recurring = timeSlotDto.is_recurring || true;
      timeSlot.doctor = doctor;
      return timeSlot;
    });

    await this.slotRepository.save(slotEntities);
    await this.timeSlotRepository.save(timeSlotEntities);

    return {
      message: 'Availability set successfully',
      slots: slotEntities,
      timeSlots: timeSlotEntities,
    };
  }

  async getAvailability(doctorId: number, date?: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: doctorId },
      relations: ['user', 'slots', 'timeSlots'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    let availableSlots = doctor.slots;

    if (date) {
      availableSlots = doctor.slots.filter(
        (slot) => slot.date === date && !slot.is_booked,
      );
    }

    return {
      doctor: {
        id: doctor.doctor_id,
        specialization: doctor.specialization,
        name: doctor.user ? doctor.user.name : 'Unknown',
      },
      availableSlots: availableSlots.filter((slot) => !slot.is_booked),
      recurringTimeSlots: doctor.timeSlots,
      bookedSlots: availableSlots.filter((slot) => slot.is_booked),
    };
  }

  // ADD THIS MISSING METHOD
  async getSlots(doctorId: number, date?: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: doctorId },
      relations: ['slots'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    let availableSlots = doctor.slots.filter((slot) => !slot.is_booked);

    if (date) {
      availableSlots = availableSlots.filter((slot) => slot.date === date);
    }

    return availableSlots;
  }

  async updateSlot(slotId: number, updateData: UpdateSlotDto) {
    const slot = await this.slotRepository.findOne({
      where: { slot_id: slotId },
    });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.is_booked) {
      throw new BadRequestException('Cannot update booked slot');
    }

    await this.slotRepository.update(slotId, updateData);
    return await this.slotRepository.findOne({
      where: { slot_id: slotId },
    });
  }

  async deleteSlot(slotId: number) {
    const slot = await this.slotRepository.findOne({
      where: { slot_id: slotId },
    });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.is_booked) {
      throw new BadRequestException('Cannot delete booked slot');
    }

    await this.slotRepository.delete(slotId);
    return { message: 'Slot deleted successfully' };
  }

  async generateSlotsFromTimeSlots(
    doctorId: number,
    startDate: string,
    endDate: string,
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: doctorId },
      relations: ['timeSlots'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const timeSlots = doctor.timeSlots.filter((ts) => ts.is_recurring);
    const generatedSlots: Slot[] = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dayName = currentDate
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();

      const dayTimeSlots = timeSlots.filter(
        (ts) => ts.day_of_week.toLowerCase() === dayName,
      );

      for (const timeSlot of dayTimeSlots) {
        const slot = new Slot();
        slot.date = currentDate.toISOString().split('T')[0];
        slot.start_time = timeSlot.start_time;
        slot.end_time = timeSlot.end_time;
        slot.doctor = doctor;
        slot.is_booked = false;

        // Check if slot already exists
        const existingSlot = await this.slotRepository.findOne({
          where: {
            doctor: { doctor_id: doctorId },
            date: slot.date,
            start_time: slot.start_time,
            end_time: slot.end_time,
          },
        });

        if (!existingSlot) {
          generatedSlots.push(slot);
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    await this.slotRepository.save(generatedSlots);
    return { message: 'Slots generated successfully', slots: generatedSlots };
  }
}
