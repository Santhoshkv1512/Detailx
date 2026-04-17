import { Controller, Get, Param, Query } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('services')
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('services/:slug')
  findOne(@Param('slug') slug: string) {
    return this.servicesService.findOne(slug);
  }

  @Get('pricing/wash')
  getWashPricing(@Query('vehicle') vehicle?: string) {
    return this.servicesService.getWashPricing(vehicle);
  }
}
