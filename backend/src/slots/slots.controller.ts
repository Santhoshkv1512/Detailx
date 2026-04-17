import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  async getAvailableSlots(@Query('date') date: string) {
    if (!date) {
      throw new BadRequestException('date query parameter is required (YYYY-MM-DD)');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new BadRequestException('date must be in YYYY-MM-DD format');
    }

    return this.slotsService.getAvailableSlots(date);
  }
}
