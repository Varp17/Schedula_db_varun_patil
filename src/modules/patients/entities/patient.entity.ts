import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn, // ADD these
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Appointment } from '../../doctors/entities/appointment.entity'; // CORRECT import path

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  patient_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.patients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  sex: string;

  @Column({ type: 'int', nullable: true })
  weight: number;

  // UNCOMMENT this relation
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @CreateDateColumn({ type: 'timestamptz' }) // ADD this
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' }) // ADD this
  updated_at: Date;
}
