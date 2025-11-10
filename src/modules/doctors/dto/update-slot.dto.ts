import { PartialType } from '@nestjs/mapped-types';
import { CreateSlotDto } from './create-availability.dto';

export class UpdateSlotDto extends PartialType(CreateSlotDto) {}
