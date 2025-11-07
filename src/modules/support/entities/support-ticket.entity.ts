/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TicketStatus {
  NEW = 'New',
  OPEN = 'Open',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn()
  ticket_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.support_tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.NEW })
  status: TicketStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
