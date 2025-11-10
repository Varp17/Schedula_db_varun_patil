import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { SupportTicket } from '../../support/entities/support-ticket.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity('users')
export class User {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
  mobile_number: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  google_id: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];

  @OneToMany(() => SupportTicket, (ticket) => ticket.user)
  support_tickets: SupportTicket[];

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctor: Doctor;
}
