import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DoctorAvailability } from './availability.entity';
import { VerificationToken } from './verification-token.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  doctor_id: number;

  @OneToOne(() => User, (user) => user.doctor)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  specialization: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  qualification: string;

  @Column({ type: 'int', nullable: true })
  experience: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clinic_address: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'decimal', nullable: true })
  consultation_fee: number;

  @OneToMany(() => DoctorAvailability, (availability) => availability.doctor)
  availability: DoctorAvailability[];

  @OneToMany(() => VerificationToken, (token) => token.doctor)
  verification_tokens: VerificationToken[];
}
