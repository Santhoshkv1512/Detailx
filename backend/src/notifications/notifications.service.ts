import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const GUPSHUP_API_URL = 'https://api.gupshup.io/sm/api/v1/msg';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly configService: ConfigService) {}

  private formatPhone(phone: string): string {
    // Ensure phone number has country code (India: 91)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return cleaned;
    }
    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }
    return cleaned;
  }

  private async sendWhatsApp(toPhone: string, message: string): Promise<void> {
    const apiKey = this.configService.get<string>('GUPSHUP_API_KEY');
    const appName = this.configService.get<string>('GUPSHUP_APP_NAME');

    if (!apiKey || !appName) {
      this.logger.warn('Gupshup credentials not configured. Skipping WhatsApp notification.');
      this.logger.debug(`Would have sent to ${toPhone}: ${message}`);
      return;
    }

    const formattedPhone = this.formatPhone(toPhone);

    const params = new URLSearchParams({
      channel: 'whatsapp',
      source: appName,
      destination: formattedPhone,
      message: JSON.stringify({ type: 'text', text: message }),
      'src.name': appName,
    });

    await axios.post(GUPSHUP_API_URL, params.toString(), {
      headers: {
        apikey: apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    this.logger.log(`WhatsApp message sent to ${formattedPhone}`);
  }

  async sendAdminAlert(booking: any): Promise<void> {
    try {
      const adminNumber = this.configService.get<string>(
        'ADMIN_WHATSAPP_NUMBER',
        '919876543210',
      );
      const studioPhone = this.configService.get<string>('STUDIO_PHONE', '+91 98765 43210');

      const slotDate = booking.slot?.date
        ? new Date(booking.slot.date).toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'N/A';

      const message =
        `*New Booking Alert - Detail X*\n\n` +
        `*Reference:* ${booking.reference}\n` +
        `*Service:* ${booking.service?.name || 'N/A'}\n` +
        `*Customer:* ${booking.customerName}\n` +
        `*Phone:* ${booking.customerPhone}\n` +
        `*Car:* ${booking.carYear} ${booking.carMake} ${booking.carModel} (${booking.carColour})\n` +
        `*Reg No:* ${booking.registrationNumber}\n` +
        `*Fuel:* ${booking.fuelType}\n` +
        `*Appointment:* ${slotDate} at ${booking.slot?.time || 'N/A'}\n` +
        `*Delivery:* ${booking.deliveryType === 'pickup' ? `Pickup - ${booking.pickupAddress}` : 'Studio Drop-in'}\n` +
        `*Add-ons:* ${booking.addOns?.length ? booking.addOns.join(', ') : 'None'}\n` +
        `*Total:* ₹${(booking.totalAmountPaise / 100).toFixed(2)}\n` +
        `*Deposit Paid:* ₹${(booking.depositPaise / 100).toFixed(2)}\n` +
        `*Balance Due:* ₹${(booking.balancePaise / 100).toFixed(2)}\n\n` +
        `Please confirm the appointment. Studio: ${studioPhone}`;

      await this.sendWhatsApp(adminNumber, message);
    } catch (err) {
      this.logger.error('sendAdminAlert failed:', err?.message || err);
      throw err;
    }
  }

  async sendCustomerConfirmation(booking: any): Promise<void> {
    try {
      const studioAddress = this.configService.get<string>(
        'STUDIO_ADDRESS',
        'DetailX Studio, Kochi, Kerala',
      );
      const studioPhone = this.configService.get<string>('STUDIO_PHONE', '+91 98765 43210');

      const slotDate = booking.slot?.date
        ? new Date(booking.slot.date).toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'N/A';

      const message =
        `*Booking Confirmed - Detail X by Ajan*\n\n` +
        `Hi ${booking.customerName},\n\n` +
        `Your booking has been confirmed! Here are your details:\n\n` +
        `*Booking Reference:* ${booking.reference}\n` +
        `*Service:* ${booking.service?.name || 'N/A'}\n` +
        `*Date & Time:* ${slotDate} at ${booking.slot?.time || 'N/A'}\n` +
        `*Vehicle:* ${booking.carYear} ${booking.carMake} ${booking.carModel}\n` +
        `*Reg No:* ${booking.registrationNumber}\n` +
        `*Delivery:* ${booking.deliveryType === 'pickup' ? `We'll pick up from: ${booking.pickupAddress}` : `Please bring your car to: ${studioAddress}`}\n\n` +
        `*Payment Summary:*\n` +
        `Total: ₹${(booking.totalAmountPaise / 100).toFixed(2)}\n` +
        `Deposit Paid: ₹${(booking.depositPaise / 100).toFixed(2)}\n` +
        `Balance Due at Studio: ₹${(booking.balancePaise / 100).toFixed(2)}\n\n` +
        `For queries, call us at ${studioPhone}.\n\n` +
        `Thank you for choosing Detail X by Ajan! We look forward to serving you.`;

      await this.sendWhatsApp(booking.customerPhone, message);
    } catch (err) {
      this.logger.error('sendCustomerConfirmation failed:', err?.message || err);
      throw err;
    }
  }
}
