import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AvailabilityService } from '../availability.service';
import { Slot } from '../../entities/slot.entity';
import { TimeSlot } from '../../entities/time-slot.entity';
import { Doctor } from '../../entities/doctor.entity';

describe('AvailabilityService', () => {
  let service: AvailabilityService;

  const mockSlotRepository = {};
  const mockTimeSlotRepository = {};
  const mockDoctorRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        {
          provide: getRepositoryToken(Slot),
          useValue: mockSlotRepository,
        },
        {
          provide: getRepositoryToken(TimeSlot),
          useValue: mockTimeSlotRepository,
        },
        {
          provide: getRepositoryToken(Doctor),
          useValue: mockDoctorRepository,
        },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
