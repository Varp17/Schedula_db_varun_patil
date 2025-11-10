import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Appointment } from './appointment.entity';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn()
  slot_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ default: false })
  is_booked: boolean;

  @ManyToOne(() => Doctor, (doctor) => doctor.slots)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @OneToOne(() => Appointment, (appointment) => appointment.slot)
  appointment: Appointment;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
