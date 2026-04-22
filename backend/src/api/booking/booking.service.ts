import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { combineDateTime } from 'src/common/helpers';
import { nanoid } from 'nanoid';
import { BookingStatus } from '@prisma/client';
import { VehicleResult } from './interfaces/vehicle.interfaces';
import { validateDateRange } from './utils/booking-helpers';
import { BookingValidatorService } from './services/booking-validator.service';
import { BookingPricingService } from './services/booking-pricing.service';
import { BookingCleanupService } from './services/booking-cleanup.service';
import { VEHICLE_INCLUDE } from './constants/vehicle-include.constant';

@Injectable()
export class BookingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validator: BookingValidatorService,
    private readonly pricing: BookingPricingService,
    private readonly cleanup: BookingCleanupService,
  ) {}

  async create(dto: CreateBookingDto, userId: string) {
    return this.prismaService.$transaction(async (tx) => {
      const {
        startDateDay,
        startDateTime,
        endDateDay,
        endDateTime,
        pickupLocationId,
        dropOffLocationId,
        bikeId,
        carId,
        ...bookingData
      } = dto;

      if (Boolean(carId) === Boolean(bikeId)) {
        throw new BadRequestException(
          'Provide either carId OR bikeId, not both',
        );
      }

      const [user] = await Promise.all([
        this.validator.validateUser(userId),
        this.validator.validateLocation(pickupLocationId, 'pickup'),
        dropOffLocationId
          ? this.validator.validateLocation(dropOffLocationId, 'dropoff')
          : Promise.resolve(),
      ]);

      const startDate = combineDateTime(startDateDay, startDateTime);
      const endDate = combineDateTime(endDateDay, endDateTime);
      validateDateRange(startDate, endDate);

      await this.validator.validateUserHasNoActiveBookings(tx, userId);

      const durationHours =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

      let vehicle: VehicleResult;

      if (carId) {
        this.validator.validateCarRequirements(user);

        const car = await this.validator.validateVehicleExistsAndAvailable(
          tx,
          'car',
          carId,
        );
        await this.validator.lockVehicleAndValidateNoConflict(
          tx,
          { carId },
          startDate,
          endDate,
        );

        vehicle = {
          type: 'car',
          vehicleId: carId,
          pricePerHour: Number(car.pricePerHour),
          pricePerDay: Number(car.pricePerDay),
          locationId: car.locationId,
        };

        await this.validator.validateVehicleLocation(vehicle, pickupLocationId);
      } else {
        this.validator.validateBikeRequirements(user);

        const bike = await this.validator.validateVehicleExistsAndAvailable(
          tx,
          'bike',
          bikeId as string,
        );
        await this.validator.lockVehicleAndValidateNoConflict(
          tx,
          { bikeId: bikeId as string },
          startDate,
          endDate,
        );

        vehicle = {
          type: 'bike',
          vehicleId: bikeId as string,
          pricePerHour: Number(bike.pricePerHour),
          pricePerDay: Number(bike.pricePerDay),
          locationId: bike.locationId,
        };

        await this.validator.validateVehicleLocation(vehicle, pickupLocationId);
      }

      const totalPrice = this.pricing.calculatePrice(
        vehicle.pricePerHour,
        vehicle.pricePerDay,
        durationHours,
      );

      return tx.booking.create({
        data: {
          ...bookingData,
          startDate,
          endDate,
          bookingNo: nanoid(6),
          totalPrice,
          user: { connect: { id: userId } },
          pickUpLocation: { connect: { id: pickupLocationId } },
          ...(dropOffLocationId && {
            dropOffLocation: { connect: { id: dropOffLocationId } },
          }),
          ...(vehicle.type === 'car' && {
            car: { connect: { id: vehicle.vehicleId } },
          }),
          ...(vehicle.type === 'bike' && {
            bike: { connect: { id: vehicle.vehicleId } },
          }),
        },
      });
    });
  }

  async getBookingById(bookingId: string, userId: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id: bookingId },
      include: VEHICLE_INCLUDE,
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    if (booking.userId !== userId) {
      throw new BadRequestException('You can only view your own bookings');
    }

    return booking;
  }

  async getMyActiveBookings(userId: string) {
    return this.prismaService.booking.findMany({
      where: {
        userId,
        status: BookingStatus.BOOKING,
        endDate: { gt: new Date() },
      },
      include: VEHICLE_INCLUDE,
      orderBy: { startDate: 'asc' },
    });
  }

  async getBookingHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prismaService.booking.findMany({
        where: {
          userId,
          status: { in: [BookingStatus.COMPLETED, BookingStatus.CANCELLED] },
        },
        include: VEHICLE_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.booking.count({
        where: {
          userId,
          status: { in: [BookingStatus.COMPLETED, BookingStatus.CANCELLED] },
        },
      }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async cancelBooking(bookingId: string, userId: string) {
    return this.prismaService.$transaction(async (tx) => {
      const booking = await this.validator.findActiveBookingOrThrow(
        tx,
        bookingId,
        userId,
      );

      const minutesUntilStart =
        (booking.startDate.getTime() - Date.now()) / (1000 * 60);

      if (minutesUntilStart < 15) {
        throw new BadRequestException(
          'Cannot cancel booking less than 15 minutes before start',
        );
      }

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      return { success: true, message: 'Booking cancelled successfully' };
    });
  }

  async endBooking(bookingId: string, userId: string) {
    return this.prismaService.$transaction(async (tx) => {
      await this.validator.findActiveBookingOrThrow(tx, bookingId, userId);

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.COMPLETED },
      });

      return { success: true, message: 'Booking completed successfully' };
    });
  }

  async getAllBookings(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prismaService.booking.findMany({
        include: {
          ...VEHICLE_INCLUDE,
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.booking.count(),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getBookingsByVehicle(
    type: 'car' | 'bike',
    vehicleId: string,
    page = 1,
    limit = 20,
  ) {
    const skip = (page - 1) * limit;
    const filter =
      type === 'car' ? { carId: vehicleId } : { bikeId: vehicleId };

    const [items, total] = await Promise.all([
      this.prismaService.booking.findMany({
        where: filter,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          pickUpLocation: true,
          dropOffLocation: true,
        },
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.booking.count({ where: filter }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
