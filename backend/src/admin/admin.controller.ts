import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * POST /api/admin/auth/login
   * Authenticate admin and receive JWT token
   */
  @Post('auth/login')
  login(@Body() body: { email: string; password: string }) {
    return this.adminService.login(body.email, body.password);
  }

  /**
   * GET /api/admin/bookings?date=&status=&deliveryType=&page=
   * List all bookings with optional filters (paginated, 20/page)
   */
  @UseGuards(JwtAuthGuard)
  @Get('bookings')
  listBookings(
    @Query('date') date?: string,
    @Query('status') status?: string,
    @Query('deliveryType') deliveryType?: string,
    @Query('page') page?: string,
  ) {
    return this.adminService.listBookings({
      date,
      status,
      deliveryType,
      page: page ? parseInt(page, 10) : 1,
    });
  }

  /**
   * GET /api/admin/bookings/:id
   * Get a single booking by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get('bookings/:id')
  getBooking(@Param('id') id: string) {
    return this.adminService.getBooking(id);
  }

  /**
   * PATCH /api/admin/bookings/:id/status
   * Update booking status and optional admin notes
   */
  @UseGuards(JwtAuthGuard)
  @Patch('bookings/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; adminNotes?: string },
  ) {
    return this.adminService.updateStatus(id, body);
  }

  /**
   * GET /api/admin/stats/today
   * Get today's operational stats
   */
  @UseGuards(JwtAuthGuard)
  @Get('stats/today')
  getTodayStats() {
    return this.adminService.getTodayStats();
  }
}
