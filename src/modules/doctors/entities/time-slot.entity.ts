import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  time_slot_id: number;

  @Column({ type: 'varchar', length: 10 })
  day_of_week: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ default: true })
  is_recurring: boolean;

  @ManyToOne(() => Doctor, (doctor) => doctor.timeSlots)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
