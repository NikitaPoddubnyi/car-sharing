import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Bike,
  BookingStatus,
  Prisma,
  UserRole,
  VehicleStatus,
} from '@prisma/client';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  CreateBikeDto,
  UpdateBikeAvailabilityDto,
  UpdateBikeDto,
  UpdateBikeStatusDto,
} from './dto';
import { BikeWithDetails, ConflictingBooking } from './types';
import { deleteImagesFromCloudinary, prepareImagesData } from './utils';
import { BIKE_MESSAGES, CLOUDINARY_FOLDERS } from './constants';
import { createBookingsFilter, overlapWhere } from 'src/common/helpers';

@Injectable()
export class BikeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findOne(id: string): Promise<BikeWithDetails> {
    const bike = await this.prismaService.bike.findUnique({
      where: { id },
      include: { images: true, location: true },
    });

    if (!bike) throw new NotFoundException(BIKE_MESSAGES.NOT_FOUND);
    return bike;
  }

  async findAllForAdmin(
    page = 1,
    limit = 20,
  ): Promise<{ items: Bike[]; meta: any }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prismaService.bike.findMany({
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
      this.prismaService.bike.count(),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAvailableBikes(
    locationId?: string,
    startDate?: Date,
    endDate?: Date,
    page = 1,
    limit = 20,
  ): Promise<{ items: Bike[]; meta: any }> {
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
      this.prismaService.bike.findMany({
        where,
        include: { images: true, location: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.bike.count({ where }),
    ]);

    const bikeIds = items.map((bike) => bike.id);

    let bookedStatusMap: Map<string | null, boolean> = new Map();

    if (!hasDates) {
      const dateBookings = await this.prismaService.booking.groupBy({
        by: ['bikeId'],
        where: {
          bikeId: { in: bikeIds },
          status: BookingStatus.BOOKING,
          endDate: { gt: new Date() },
        },
      });

      bookedStatusMap = new Map(dateBookings.map((b) => [b.bikeId, true]));
    }

    const itemsWithStatus = items.map((bike) => ({
      ...bike,
      isBooked: bookedStatusMap.get(bike.id) || false,
    }));

    return {
      items: itemsWithStatus,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async checkBikeAvailability(
    bikeId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ available: boolean; conflicts: ConflictingBooking[] }> {
    const conflicts = await this.prismaService.booking.findMany({
      where: { bikeId, ...overlapWhere(startDate, endDate) },
      select: { id: true, startDate: true, endDate: true },
    });

    return { available: conflicts.length === 0, conflicts };
  }

  async create(
    dto: CreateBikeDto,
    files: { images: Express.Multer.File[] },
    ownerId: string,
    userRole: UserRole,
  ): Promise<Bike> {
    const { locationId, ...bikeData } = dto;

    const [existingBike, location] = await Promise.all([
      this.prismaService.bike.findFirst({
        where: {
          brand: bikeData.brand,
          model: bikeData.model,
          year: bikeData.year,
          mileage: bikeData.mileage,
          ownerId,
        },
      }),
      this.prismaService.location.findUnique({ where: { id: locationId } }),
    ]);

    if (existingBike) {
      throw new BadRequestException(BIKE_MESSAGES.DUPLICATE_BIKE);
    }
    if (!location) {
      throw new NotFoundException(BIKE_MESSAGES.LOCATION_NOT_FOUND);
    }

    const uploaded = await this.cloudinary.uploadFiles(
      files.images,
      CLOUDINARY_FOLDERS.BIKES,
    );
    if (!uploaded?.length) {
      throw new BadRequestException(BIKE_MESSAGES.NO_IMAGES);
    }

    return this.prismaService.bike.create({
      data: {
        ...bikeData,
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
    dto: UpdateBikeDto,
    files: { images?: Express.Multer.File[] },
    ownerId?: string,
    userRole?: UserRole,
  ): Promise<Bike> {
    const bike = await this.findOne(id);

    if (bike.ownerId !== ownerId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(BIKE_MESSAGES.FORBIDDEN_UPDATE);
    }

    const { locationId, status, newOwnerId, ...bikeData } = dto;
    const updateData: Prisma.BikeUpdateInput = { ...bikeData };

    if (locationId) {
      const location = await this.prismaService.location.findUnique({
        where: { id: locationId },
      });
      if (!location)
        throw new NotFoundException(BIKE_MESSAGES.LOCATION_NOT_FOUND);
      updateData.location = { connect: { id: locationId } };
    }

    if (newOwnerId && userRole === UserRole.ADMIN) {
      const newOwner = await this.prismaService.user.findUnique({
        where: { id: newOwnerId },
      });
      if (!newOwner)
        throw new NotFoundException(BIKE_MESSAGES.NEW_OWNER_NOT_FOUND);
      updateData.owner = { connect: { id: newOwnerId } };
    }

    if (status && userRole === UserRole.ADMIN) {
      updateData.status = status;
    }

    if (files?.images?.length) {
      const uploaded = await this.cloudinary.uploadFiles(
        files.images,
        CLOUDINARY_FOLDERS.BIKES,
      );
      updateData.images = {
        deleteMany: {},
        create: prepareImagesData(uploaded),
      };
      await deleteImagesFromCloudinary(this.cloudinary, bike.images);
    }

    return this.prismaService.bike.update({
      where: { id },
      data: updateData,
      include: { images: true, location: true },
    });
  }

  async updateImages(
    id: string,
    files: { images: Express.Multer.File[] },
  ): Promise<Bike> {
    if (!files.images?.length) {
      throw new BadRequestException(BIKE_MESSAGES.NO_IMAGES);
    }

    const bike = await this.findOne(id);
    const uploaded = await this.cloudinary.uploadFiles(
      files.images,
      CLOUDINARY_FOLDERS.BIKES,
    );

    const updatedBike = await this.prismaService.bike.update({
      where: { id },
      data: {
        images: {
          deleteMany: {},
          create: prepareImagesData(uploaded),
        },
      },
      include: { images: true, location: true },
    });

    await deleteImagesFromCloudinary(this.cloudinary, bike.images);
    return updatedBike;
  }

  async updateLocation(id: string, locationId: string): Promise<Bike> {
    if (!locationId) {
      throw new BadRequestException(BIKE_MESSAGES.LOCATION_ID_REQUIRED);
    }

    const location = await this.prismaService.location.findUnique({
      where: { id: locationId },
    });
    if (!location)
      throw new NotFoundException(BIKE_MESSAGES.LOCATION_NOT_FOUND);

    return this.prismaService.bike.update({
      where: { id },
      data: { location: { connect: { id: locationId } } },
      include: { images: true, location: true },
    });
  }

  async updateStatus(id: string, dto: UpdateBikeStatusDto): Promise<Bike> {
    await this.findOne(id);

    return this.prismaService.bike.update({
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
    dto: UpdateBikeAvailabilityDto,
  ): Promise<Bike> {
    const bike = await this.findOne(id);

    return this.prismaService.bike.update({
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
    const bike = await this.findOne(id);

    if (bike.ownerId !== ownerId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(BIKE_MESSAGES.FORBIDDEN_DELETE);
    }

    await this.prismaService.bike.delete({ where: { id } });
    await deleteImagesFromCloudinary(this.cloudinary, bike.images);

    return true;
  }
}
