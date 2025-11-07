/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  //OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
//import { Appointment } from '../../appointments/entities/appointment.entity';

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
  // @OneToMany(() => Appointment, (appointment) => appointment.patient)//   appointments: Appointment[];
}
