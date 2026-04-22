import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Authorization, Authorized } from 'src/common/decorators';
import { type User, UserRole } from '@prisma/client';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Authorization()
  async create(@Body() dto: CreateBookingDto, @Authorized() user: User) {
    return await this.bookingService.create(dto, user.id);
  }

  @Get('me/active')
  @Authorization()
  async getMyActiveBookings(@Authorized() user: User) {
    return await this.bookingService.getMyActiveBookings(user.id);
  }

  @Get('me/history')
  @Authorization()
  async getMyBookingHistory(
    @Authorized() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return await this.bookingService.getBookingHistory(user.id, page, limit);
  }

  @Get(':id')
  @Authorization()
  async getBookingById(@Param('id') id: string, @Authorized() user: User) {
    return await this.bookingService.getBookingById(id, user.id);
  }

  @Patch(':id/cancel')
  @Authorization()
  async cancelBooking(@Param('id') id: string, @Authorized() user: User) {
    return await this.bookingService.cancelBooking(id, user.id);
  }

  @Patch(':id/end')
  @Authorization()
  async endBooking(@Param('id') id: string, @Authorized() user: User) {
    return await this.bookingService.endBooking(id, user.id);
  }

  @Get('admin/all')
  @Authorization(UserRole.ADMIN)
  async getAllBookings(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return await this.bookingService.getAllBookings(page, limit);
  }

  @Get('admin/vehicle/:type/:id')
  @Authorization(UserRole.ADMIN)
  async getBookingsByVehicle(
    @Param('type') type: 'car' | 'bike',
    @Param('id') vehicleId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return await this.bookingService.getBookingsByVehicle(
      type,
      vehicleId,
      page,
      limit,
    );
  }
}
