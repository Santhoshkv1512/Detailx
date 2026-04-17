import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SlotsService } from '../slots/slots.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slotsService: SlotsService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a booking reference: DX-YYYYMMDD-XXX
   * XXX = count of existing bookings for that date, zero-padded to 3 digits, starting from 001
   */
  private async generateReference(date: string): Promise<string> {
    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const count = await this.prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const datePart = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    const seq = String(count + 1).padStart(3, '0');
    return `DX-${datePart}-${seq}`;
  }

  async initiateBooking(dto: CreateBookingDto) {
    const { serviceId, date, time, deliveryType, pickupAddress, totalAmountPaise } = dto;

    // Validate pickup address when delivery type is pickup
    if (deliveryType === 'pickup' && !pickupAddress) {
      throw new BadRequestException('pickupAddress is required when deliveryType is pickup');
    }

    // Check if service exists
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.isActive) {
      throw new BadRequestException(`Service with id "${serviceId}" not found or inactive`);
    }

    // Check slot availability (DB + Redis)
    const available = await this.slotsService.isSlotAvailable(date, time);
    if (!available) {
      throw new BadRequestException(
        `Time slot ${time} on ${date} is no longer available. Please choose another slot.`,
      );
    }

    // Calculate deposit: 20% of total, minimum ₹200 (20000 paise)
    const depositPaise = Math.max(Math.round(totalAmountPaise * 0.2), 20000);
    const balancePaise = totalAmountPaise - depositPaise;

    // Get or create TimeSlot record
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));

    let timeSlot = await this.prisma.timeSlot.findFirst({
      where: { date: dateObj, time },
    });

    if (!timeSlot) {
      timeSlot = await this.prisma.timeSlot.create({
        data: { date: dateObj, time, isBooked: false },
      });
    }

    // Generate booking reference
    const reference = await this.generateReference(date);

    // Create booking record
    const booking = await this.prisma.booking.create({
      data: {
        reference,
        serviceId,
        slotId: timeSlot.id,
        addOns: dto.addOns || [],
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        carMake: dto.carMake,
        carModel: dto.carModel,
        carYear: dto.carYear,
        carColour: dto.carColour,
        registrationNumber: dto.registrationNumber,
        fuelType: dto.fuelType,
        deliveryType,
        pickupAddress: pickupAddress || null,
        totalAmountPaise,
        depositPaise,
        balancePaise,
        paymentStatus: 'pending',
        status: 'confirmed',
      },
      include: {
        service: true,
        slot: true,
      },
    });

    // Reserve the slot in Redis for 15 minutes
    await this.slotsService.reserveSlot(date, time, booking.id);

    this.logger.log(`Booking initiated: ${reference} for slot ${date} ${time}`);

    return {
      bookingId: booking.id,
      reference: booking.reference,
      depositPaise: booking.depositPaise,
      balancePaise: booking.balancePaise,
      totalAmountPaise: booking.totalAmountPaise,
      service: booking.service.name,
      slot: { date, time },
      paymentStatus: booking.paymentStatus,
    };
  }

  async initiatePayment(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, slot: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }

    if (booking.paymentStatus === 'paid') {
      throw new BadRequestException('Payment has already been completed for this booking');
    }

    const env = this.configService.get<string>('PHONEPE_ENV', 'SANDBOX');
    const redirectUrl = this.configService.get<string>(
      'PHONEPE_REDIRECT_URL',
      'https://yourdomain.com/booking/confirmation',
    );

    this.logger.log(
      `Payment initiation requested for booking ${booking.reference} in ${env} mode`,
    );

    // In SANDBOX mode, return a mock redirect URL
    // In production, integrate with PhonePe SDK using actual merchant credentials
    if (env === 'SANDBOX') {
      const mockRedirectUrl = `${redirectUrl}?ref=${booking.reference}&status=SUCCESS&bookingId=${booking.id}`;
      this.logger.log(`SANDBOX: Mock payment URL generated for ${booking.reference}`);
      return {
        redirectUrl: mockRedirectUrl,
        reference: booking.reference,
        amountPaise: booking.depositPaise,
        environment: 'SANDBOX',
        note: 'This is a sandbox mock payment URL. Replace with actual PhonePe SDK integration for production.',
      };
    }

    // Production PhonePe integration placeholder
    throw new BadRequestException(
      'PhonePe production integration requires merchant credentials. Configure PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, and PHONEPE_ENV=PRODUCTION.',
    );
  }

  async paymentCallback(body: any) {
    this.logger.log('Payment callback received:', JSON.stringify(body));

    const { reference, status, transactionId } = body;

    if (!reference) {
      throw new BadRequestException('Missing reference in callback payload');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { reference },
      include: { service: true, slot: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with reference ${reference} not found`);
    }

    if (status === 'SUCCESS' || status === 'PAYMENT_SUCCESS') {
      // Get slot date string from booking slot
      const slotDate = booking.slot.date;
      const year = slotDate.getUTCFullYear();
      const month = String(slotDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(slotDate.getUTCDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      // Update booking payment status
      const updatedBooking = await this.prisma.booking.update({
        where: { reference },
        data: {
          paymentStatus: 'paid',
          phonepeTransactionId: transactionId || null,
          status: 'confirmed',
        },
        include: { service: true, slot: true },
      });

      // Mark the slot as booked in DB and clear Redis reservation
      await this.slotsService.markSlotBooked(dateStr, booking.slot.time);

      // Send notifications (non-blocking — failure must not break flow)
      await this.notificationsService.sendAdminAlert(updatedBooking).catch((err) => {
        this.logger.error('Failed to send admin WhatsApp alert:', err);
      });

      await this.notificationsService.sendCustomerConfirmation(updatedBooking).catch((err) => {
        this.logger.error('Failed to send customer WhatsApp confirmation:', err);
      });

      this.logger.log(`Payment confirmed for booking ${reference}`);
      return { success: true, reference, status: 'paid' };
    } else {
      // Payment failed or cancelled
      await this.prisma.booking.update({
        where: { reference },
        data: { paymentStatus: 'failed' },
      });

      this.logger.warn(`Payment failed/cancelled for booking ${reference}, status: ${status}`);
      return { success: false, reference, status: 'failed' };
    }
  }

  async getStatus(reference: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { reference },
      include: {
        service: true,
        slot: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with reference "${reference}" not found`);
    }

    return booking;
  }
}
