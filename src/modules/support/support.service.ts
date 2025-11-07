import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus } from './entities/support-ticket.entity';
import { User } from '../users/entities/user.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private supportRepository: Repository<SupportTicket>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createTicket(
    userId: number,
    createTicketDto: CreateTicketDto,
  ): Promise<SupportTicket> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const ticket = this.supportRepository.create({
      ...createTicketDto,
      user_id: userId,
      status: TicketStatus.NEW,
    });

    return this.supportRepository.save(ticket);
  }

  async getUserTickets(userId: number): Promise<SupportTicket[]> {
    return this.supportRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async getTicketById(ticketId: number): Promise<SupportTicket> {
    const ticket = await this.supportRepository.findOne({
      where: { ticket_id: ticketId },
      relations: ['user'],
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  }
}
