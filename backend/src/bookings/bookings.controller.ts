import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * POST /api/bookings/initiate
   * Initiate a new booking and reserve the slot for 15 minutes
   */
  @Post('initiate')
  initiateBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.initiateBooking(dto);
  }

  /**
   * POST /api/bookings/:id/payment/initiate
   * Initiate payment for an existing booking
   */
  @Post(':id/payment/initiate')
  initiatePayment(@Param('id') id: string) {
    return this.bookingsService.initiatePayment(id);
  }

  /**
   * POST /api/bookings/payment/callback
   * PhonePe payment callback webhook
   */
  @Post('payment/callback')
  paymentCallback(@Body() body: any) {
    return this.bookingsService.paymentCallback(body);
  }

  /**
   * GET /api/bookings/status/:reference
   * Get booking status by reference number
   */
  @Get('status/:reference')
  getStatus(@Param('reference') reference: string) {
    return this.bookingsService.getStatus(reference);
  }
}
