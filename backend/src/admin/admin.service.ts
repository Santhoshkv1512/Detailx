import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const admin = await this.prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: admin.id, email: admin.email };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Admin logged in: ${email}`);
    return { accessToken };
  }

  async listBookings(query: {
    date?: string;
    status?: string;
    deliveryType?: string;
    page?: number;
  }) {
    const { date, status, deliveryType, page = 1 } = query;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (deliveryType) {
      where.deliveryType = deliveryType;
    }

    if (date) {
      const [year, month, day] = date.split('-').map(Number);
      const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      where.createdAt = { gte: startOfDay, lte: endOfDay };
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          service: true,
          slot: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getBooking(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        slot: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }

    return booking;
  }

  async updateStatus(id: string, body: { status: string; adminNotes?: string }) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
      },
      include: {
        service: true,
        slot: true,
      },
    });

    this.logger.log(`Booking ${id} status updated to "${body.status}" by admin`);
    return updated;
  }

  async getTodayStats() {
    const now = new Date();
    const todayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0),
    );
    const todayEnd = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
    );

    const todayFilter = { createdAt: { gte: todayStart, lte: todayEnd } };

    const [totalToday, pickupRequests, inProgress, completedToday] = await Promise.all([
      // Total bookings created today
      this.prisma.booking.count({ where: todayFilter }),

      // Pickup requests for today
      this.prisma.booking.count({
        where: { ...todayFilter, deliveryType: 'pickup' },
      }),

      // Currently in-progress bookings
      this.prisma.booking.count({
        where: { ...todayFilter, status: 'in_progress' },
      }),

      // Completed today
      this.prisma.booking.count({
        where: { ...todayFilter, status: 'completed' },
      }),
    ]);

    return {
      totalToday,
      pickupRequests,
      inProgress,
      completedToday,
    };
  }
}
