/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @UseGuards(JwtAuthGuard)
  async createTicket(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    return this.supportService.createTicket(req.user.sub, createTicketDto);
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  async getUserTickets(@Request() req) {
    return this.supportService.getUserTickets(req.user.sub);
  }

  @Get('tickets/:id')
  @UseGuards(JwtAuthGuard)
  async getTicket(@Param('id') id: string) {
    return this.supportService.getTicketById(parseInt(id));
  }
}
