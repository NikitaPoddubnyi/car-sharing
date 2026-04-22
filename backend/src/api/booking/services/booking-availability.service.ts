import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { BookingStatus, VehicleStatus } from '@prisma/client';
import { primaryImageInclude } from '../utils/booking-helpers';

@Injectable()
export class BookingAvailabilityService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAvailableCars(locationId?: string) {
    const now = new Date();

    const activeBookings = await this.prismaService.booking.findMany({
      where: {
        status: BookingStatus.BOOKING,
        startDate: { lte: now },
        endDate: { gt: now },
        carId: { not: null },
      },
      select: { carId: true },
    });

    const bookedIds = activeBookings
      .filter((b) => b.carId !== null)
      .map((b) => b.carId as string);

    return this.prismaService.car.findMany({
      where: {
        status: VehicleStatus.APPROVED,
        isAvailable: true,
        ...(locationId && { locationId }),
        id: { notIn: bookedIds },
      },
      include: {
        location: true,
        images: primaryImageInclude(),
      },
    });
  }

  async getAvailableBikes(locationId?: string) {
    const now = new Date();

    const activeBookings = await this.prismaService.booking.findMany({
      where: {
        status: BookingStatus.BOOKING,
        startDate: { lte: now },
        endDate: { gt: now },
        bikeId: { not: null },
      },
      select: { bikeId: true },
    });

    const bookedIds = activeBookings
      .filter((b) => b.bikeId !== null)
      .map((b) => b.bikeId as string);

    return this.prismaService.bike.findMany({
      where: {
        status: VehicleStatus.APPROVED,
        isAvailable: true,
        ...(locationId && { locationId }),
        id: { notIn: bookedIds },
      },
      include: {
        location: true,
        images: primaryImageInclude(),
      },
    });
  }
}
