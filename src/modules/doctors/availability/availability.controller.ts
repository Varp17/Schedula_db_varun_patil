import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from '../dto/create-availability.dto';
import { UpdateSlotDto } from '../dto/update-slot.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('doctor/availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post(':doctorId')
  async setAvailability(
    @Param('doctorId') doctorId: number,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ) {
    return await this.availabilityService.setAvailability(
      doctorId,
      createAvailabilityDto,
    );
  }

  @Get(':doctorId')
  async getAvailability(
    @Param('doctorId') doctorId: number,
    @Query('date') date?: string,
  ) {
    return await this.availabilityService.getAvailability(doctorId, date);
  }

  // REMOVE this endpoint or add the method to service
  // @Get(':doctorId/slots')
  // async getSlots(
  //   @Param('doctorId') doctorId: number,
  //   @Query('date') date?: string
  // ) {
  //   return this.availabilityService.getSlots(doctorId, date);
  // }

  @Put('slot/:slotId')
  async updateSlot(
    @Param('slotId') slotId: number,
    @Body() updateData: UpdateSlotDto,
  ) {
    return await this.availabilityService.updateSlot(slotId, updateData);
  }

  @Delete('slot/:slotId')
  async deleteSlot(@Param('slotId') slotId: number) {
    return await this.availabilityService.deleteSlot(slotId);
  }

  @Post(':doctorId/generate-slots')
  async generateSlots(
    @Param('doctorId') doctorId: number,
    @Body() generateSlotsDto: { startDate: string; endDate: string },
  ) {
    return await this.availabilityService.generateSlotsFromTimeSlots(
      doctorId,
      generateSlotsDto.startDate,
      generateSlotsDto.endDate,
    );
  }
}
