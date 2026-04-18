import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { REDIS_CLIENT } from './slots.constants';
import Redis from 'ioredis';

const AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00'];
const SLOT_RESERVATION_TTL_SECONDS = 15 * 60; // 15 minutes

@Injectable()
export class SlotsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  private redisKey(date: string, time: string): string {
    return `slot:${date}:${time}`;
  }

  async getAvailableSlots(date: string): Promise<{ time: string; isAvailable: boolean }[]> {
    // Parse the date string as a UTC date to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));

    // Fetch all TimeSlot records for this date
    const existingSlots = await this.prisma.timeSlot.findMany({
      where: {
        date: dateObj,
      },
    });

    const bookedInDb = new Set(
      existingSlots.filter((s) => s.isBooked).map((s) => s.time),
    );

    const result: { time: string; isAvailable: boolean }[] = [];

    for (const time of AVAILABLE_TIMES) {
      // Check DB booking
      if (bookedInDb.has(time)) {
        result.push({ time, isAvailable: false });
        continue;
      }

      // Check Redis reservation (15-min hold)
      const reservedBookingId = await this.redis.get(this.redisKey(date, time));
      if (reservedBookingId) {
        result.push({ time, isAvailable: false });
        continue;
      }

      result.push({ time, isAvailable: true });
    }

    return result;
  }

  async reserveSlot(date: string, time: string, bookingId: string): Promise<void> {
    await this.redis.set(
      this.redisKey(date, time),
      bookingId,
      'EX',
      SLOT_RESERVATION_TTL_SECONDS,
    );
  }

  async releaseSlotReservation(date: string, time: string): Promise<void> {
    await this.redis.del(this.redisKey(date, time));
  }

  async isSlotAvailable(date: string, time: string): Promise<boolean> {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));

    const existingSlot = await this.prisma.timeSlot.findFirst({
      where: { date: dateObj, time, isBooked: true },
    });

    if (existingSlot) return false;

    const reserved = await this.redis.get(this.redisKey(date, time));
    if (reserved) return false;

    return true;
  }

  async markSlotBooked(date: string, time: string): Promise<void> {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));

    // Upsert the TimeSlot record as booked
    const existing = await this.prisma.timeSlot.findFirst({
      where: { date: dateObj, time },
    });

    if (existing) {
      await this.prisma.timeSlot.update({
        where: { id: existing.id },
        data: { isBooked: true },
      });
    } else {
      await this.prisma.timeSlot.create({
        data: { date: dateObj, time, isBooked: true },
      });
    }

    // Clean up Redis reservation
    await this.redis.del(this.redisKey(date, time));
  }
}
