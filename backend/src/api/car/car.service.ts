import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BookingStatus,
  Car,
  Prisma,
  UserRole,
  VehicleStatus,
} from '@prisma/client';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  CreateCarDto,
  UpdateCarAvailabilityDto,
  UpdateCarDto,
  UpdateCarStatusDto,
} from './dto';
import { CarWithDetails } from './types';
import { deleteImagesFromCloudinary, prepareImagesData } from './utils';
import { CAR_MESSAGES, CLOUDINARY_FOLDERS } from './constants';
import { createBookingsFilter, overlapWhere } from 'src/common/helpers';
import { ConflictingBooking } from '../bike/types';
import { availableMemory } from 'process';

@Injectable()
export class CarService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findOne(id: string): Promise<CarWithDetails> {
    const car = await this.prismaService.car.findUnique({
      where: { id },
      include: { images: true, location: true },
    });

    if (!car) throw new NotFoundException(CAR_MESSAGES.NOT_FOUND);
    return car;
  }

  async findAllForAdmin(
    page = 1,
    limit = 20,
  ): Promise<{ items: Car[]; meta: any }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prismaService.car.findMany({
        include: {
          images: true,
          location: true,
          owner: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.car.count(),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAvailableCars(
    locationId?: string,
    startDate?: Date,
    endDate?: Date,
    page = 1,
    limit = 20,
  ): Promise<{ items: Car[]; meta: any }> {
    const skip = (page - 1) * limit;
    const bookingsFilter = createBookingsFilter(startDate, endDate);
    const hasDates = startDate && endDate;

    const where: any = {
      status: VehicleStatus.APPROVED,
      isAvailable: true,
    };

    if (locationId) {
      where.locationId = locationId;
    }

    if (bookingsFilter) {
      where.bookings = bookingsFilter;
    }

    const [items, total] = await Promise.all([
      this.prismaService.car.findMany({
        where,
        include: { images: true, location: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.car.count({ where }),
    ]);

    const carIds = items.map((car) => car.id);

    let bookedStatusMap: Map<string | null, boolean> = new Map();

    if (!hasDates) {
      const activeBookings = await this.prismaService.booking.groupBy({
        by: ['carId'],
        where: {
          carId: { in: carIds },
          status: BookingStatus.BOOKING,
          endDate: { gt: new Date() },
        },
      });

      bookedStatusMap = new Map(activeBookings.map((b) => [b.carId, true]));
    } else {
      const dateBookings = await this.prismaService.booking.groupBy({
        by: ['carId'],
        where: {
          carId: { in: carIds },
          status: BookingStatus.BOOKING,
          startDate: { lt: endDate },
          endDate: { gt: startDate },
        },
      });

      bookedStatusMap = new Map(dateBookings.map((b) => [b.carId, true]));
    }

    const itemsWithStatus = items.map((car) => ({
      ...car,
      isBooked: bookedStatusMap.get(car.id) || false,
    }));

    return {
      items: itemsWithStatus,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async checkCarAvailability(
    carId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ available: boolean; conflicts: ConflictingBooking[] }> {
    const conflicts = await this.prismaService.booking.findMany({
      where: { carId, ...overlapWhere(startDate, endDate) },
      select: { id: true, startDate: true, endDate: true },
    });

    return { available: conflicts.length === 0, conflicts };
  }

  async create(
    dto: CreateCarDto,
    files: { images: Express.Multer.File[] },
    ownerId: string,
    userRole: UserRole,
  ): Promise<Car> {
    const { locationId, ...carData } = dto;

    const [existingCar, location] = await Promise.all([
      this.prismaService.car.findFirst({
        where: {
          brand: carData.brand,
          model: carData.model,
          year: carData.year,
          mileage: carData.mileage,
          ownerId,
        },
      }),
      this.prismaService.location.findUnique({ where: { id: locationId } }),
    ]);

    if (existingCar) {
      throw new BadRequestException(CAR_MESSAGES.DUPLICATE_CAR);
    }
    if (!location) {
      throw new NotFoundException(CAR_MESSAGES.LOCATION_NOT_FOUND);
    }

    const uploaded = await this.cloudinary.uploadFiles(
      files.images,
      CLOUDINARY_FOLDERS.CARS,
    );
    if (!uploaded?.length) {
      throw new BadRequestException(CAR_MESSAGES.NO_IMAGES);
    }

    return this.prismaService.car.create({
      data: {
        ...carData,
        status:
          userRole === UserRole.ADMIN
            ? VehicleStatus.APPROVED
            : VehicleStatus.PENDING,
        owner: { connect: { id: ownerId } },
        location: { connect: { id: locationId } },
        images: { create: prepareImagesData(uploaded) },
      },
      include: { images: true, location: true },
    });
  }

  async update(
    id: string,
    dto: UpdateCarDto,
    files: { images?: Express.Multer.File[] },
    ownerId?: string,
    userRole?: UserRole,
  ): Promise<Car> {
    const car = await this.findOne(id);

    if (car.ownerId !== ownerId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(CAR_MESSAGES.FORBIDDEN_UPDATE);
    }

    const { locationId, status, newOwnerId, ...carData } = dto;
    const updateData: Prisma.CarUpdateInput = { ...carData };

    if (locationId) {
      const location = await this.prismaService.location.findUnique({
        where: { id: locationId },
      });
      if (!location)
        throw new NotFoundException(CAR_MESSAGES.LOCATION_NOT_FOUND);
      updateData.location = { connect: { id: locationId } };
    }

    if (newOwnerId && userRole === UserRole.ADMIN) {
      const newOwner = await this.prismaService.user.findUnique({
        where: { id: newOwnerId },
      });
      if (!newOwner)
        throw new NotFoundException(CAR_MESSAGES.NEW_OWNER_NOT_FOUND);
      updateData.owner = { connect: { id: newOwnerId } };
    }

    if (status && userRole === UserRole.ADMIN) {
      updateData.status = status;
    }

    if (files?.images?.length) {
      const uploaded = await this.cloudinary.uploadFiles(
        files.images,
        CLOUDINARY_FOLDERS.CARS,
      );
      updateData.images = {
        deleteMany: {},
        create: prepareImagesData(uploaded),
      };
      await deleteImagesFromCloudinary(this.cloudinary, car.images);
    }

    return this.prismaService.car.update({
      where: { id },
      data: updateData,
      include: { images: true, location: true },
    });
  }

  async updateImages(
    id: string,
    files: { images: Express.Multer.File[] },
  ): Promise<Car> {
    if (!files.images?.length) {
      throw new BadRequestException(CAR_MESSAGES.NO_IMAGES);
    }

    const car = await this.findOne(id);
    const uploaded = await this.cloudinary.uploadFiles(
      files.images,
      CLOUDINARY_FOLDERS.CARS,
    );

    const updatedCar = await this.prismaService.car.update({
      where: { id },
      data: {
        images: {
          deleteMany: {},
          create: prepareImagesData(uploaded),
        },
      },
      include: { images: true, location: true },
    });

    await deleteImagesFromCloudinary(this.cloudinary, car.images);
    return updatedCar;
  }

  async updateLocation(id: string, locationId: string): Promise<Car> {
    if (!locationId) {
      throw new BadRequestException(CAR_MESSAGES.LOCATION_ID_REQUIRED);
    }

    const location = await this.prismaService.location.findUnique({
      where: { id: locationId },
    });
    if (!location) throw new NotFoundException(CAR_MESSAGES.LOCATION_NOT_FOUND);

    return this.prismaService.car.update({
      where: { id },
      data: { location: { connect: { id: locationId } } },
      include: { images: true, location: true },
    });
  }

  async updateStatus(id: string, dto: UpdateCarStatusDto): Promise<Car> {
    await this.findOne(id);

    return this.prismaService.car.update({
      where: { id },
      data: { status: dto.status },
      include: {
        images: true,
        location: true,
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async updateAvailability(
    id: string,
    dto: UpdateCarAvailabilityDto,
  ): Promise<Car> {
    await this.findOne(id);

    return this.prismaService.car.update({
      where: { id },
      data: { isAvailable: dto.isAvailable },
      include: { images: true, location: true },
    });
  }

  async delete(
    id: string,
    ownerId: string,
    userRole: UserRole,
  ): Promise<boolean> {
    const car = await this.findOne(id);

    if (car.ownerId !== ownerId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(CAR_MESSAGES.FORBIDDEN_DELETE);
    }

    await this.prismaService.car.delete({ where: { id } });
    await deleteImagesFromCloudinary(this.cloudinary, car.images);

    return true;
  }
}
