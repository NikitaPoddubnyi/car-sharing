import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  BookingStatus,
  Car,
  DriverLicenseStatus,
  Prisma,
  VehicleStatus,
} from '@prisma/client';
import { VehicleResult } from '../interfaces/vehicle.interfaces';

@Injectable()
export class BookingValidatorService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { license: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async validateLocation(locationId: string, type: 'pickup' | 'dropoff') {
    const location = await this.prismaService.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException(
        `${type} location with ID ${locationId} not found`,
      );
    }

    return location;
  }

  async validateVehicleLocation(
    vehicle: VehicleResult,
    pickupLocationId: string,
  ) {
    if (vehicle.locationId !== pickupLocationId) {
      throw new BadRequestException(
        `Selected ${vehicle.type} is not available at the chosen pickup location`,
      );
    }
  }

  validateDriverLicenseForCar(user: any) {
    if (!user.license) {
      throw new BadRequestException('Driver license required to rent a car');
    }
    if (user.license.status !== DriverLicenseStatus.APPROVED) {
      throw new BadRequestException('Driver license not approved yet');
    }
    if (user.license.expiryDate < new Date()) {
      throw new BadRequestException('Driver license has expired');
    }
  }

  validateAge(user: any, minimumAge: number = 18) {
    if (!user.birthDate) {
      throw new BadRequestException('Birth date is required to rent a vehicle');
    }

    const age = this.calculateAge(user.birthDate);
    if (age < minimumAge) {
      throw new BadRequestException(
        `Minimum age to rent this vehicle is ${minimumAge} years`,
      );
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  validateCarRequirements(user: any) {
    this.validateDriverLicenseForCar(user);
    this.validateAge(user, 21);
  }

  validateBikeRequirements(user: any) {
    this.validateAge(user, 18);
  }

  async lockVehicleAndValidateNoConflict(
    tx: Prisma.TransactionClient,
    vehicleFilter: { carId?: string; bikeId?: string },
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const vehicleId = vehicleFilter.carId ?? vehicleFilter.bikeId;
    const table = vehicleFilter.carId ? '"Car"' : '"Bike"';

    await tx.$executeRawUnsafe(
      `SELECT id FROM ${table} WHERE id = $1 FOR UPDATE`,
      vehicleId,
    );

    const conflict = await tx.booking.findFirst({
      where: {
        ...vehicleFilter,
        status: BookingStatus.BOOKING,
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    });

    if (conflict) {
      const type = vehicleFilter.carId ? 'Car' : 'Bike';
      throw new BadRequestException(
        `${type} is already booked for this period`,
      );
    }
  }

  async validateVehicleExistsAndAvailable(
    tx: Prisma.TransactionClient,
    type: 'car' | 'bike',
    vehicleId: string,
  ) {
    let vehicle;

    if (type === 'car') {
      vehicle = await tx.car.findUnique({ where: { id: vehicleId } });
    } else {
      vehicle = await tx.bike.findUnique({ where: { id: vehicleId } });
    }

    if (!vehicle) {
      throw new NotFoundException(
        `${type === 'car' ? 'Car' : 'Bike'} with ID ${vehicleId} not found`,
      );
    }

    if (vehicle.status !== VehicleStatus.APPROVED) {
      throw new BadRequestException(
        `${type === 'car' ? 'Car' : 'Bike'} is not approved yet`,
      );
    }

    if (!vehicle.isAvailable) {
      throw new BadRequestException(
        `${type === 'car' ? 'Car' : 'Bike'} is currently unavailable (maintenance or broken). Please contact support.`,
      );
    }

    return vehicle;
  }

  async validateUserHasNoActiveBookings(
    tx: Prisma.TransactionClient,
    userId: string,
  ) {
    const activeBooking = await tx.booking.findFirst({
      where: {
        userId,
        status: BookingStatus.BOOKING,
        endDate: { gt: new Date() },
      },
    });

    if (activeBooking) {
      throw new BadRequestException(
        `You already have an active booking #${activeBooking.bookingNo}`,
      );
    }
  }

  async findActiveBookingOrThrow(
    tx: Prisma.TransactionClient,
    bookingId: string,
    userId: string,
  ) {
    const booking = await tx.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    if (booking.userId !== userId) {
      throw new BadRequestException('You can only manage your own bookings');
    }
    if (booking.status !== BookingStatus.BOOKING) {
      throw new BadRequestException(
        'Booking is already completed or cancelled',
      );
    }

    return booking;
  }
}
