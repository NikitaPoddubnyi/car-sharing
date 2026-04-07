import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Car, CarImage, Location, Prisma } from '@prisma/client';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateCarDto, UpdateCarDto } from './dto';
import { getPublicId } from 'src/common/helpers';

@Injectable()
export class CarService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly cloudinary: CloudinaryService,
	) {}

	async findAll()
	: Promise<Car[]> {
        return await this.prismaService.car.findMany({
            include: { images: true, location: true }
        });
    }

	async findOne(id: string): Promise<Car & { images: CarImage[]; location: Location }> {
    const car = await this.prismaService.car.findUnique({
        where: { id },
        include: { images: true, location: true }
    });

    if (!car) throw new NotFoundException('Car not found');
    return car;
}

	async create(dto: CreateCarDto, files: { images: Express.Multer.File[] }): Promise<Car> {
	 	const { locationId, ...carData } = dto;

		const location = await this.prismaService.location.findUnique({
			where: { id: dto.locationId },
		});

		if (!location) {
			throw new NotFoundException('Location not found');
		}

		const uploaded = await this.cloudinary.uploadFiles(files.images, 'cars');

		if (!uploaded || uploaded.length === 0) {
  			throw new BadRequestException('No images uploaded');
		}

		const imagesToCreate = uploaded.map((image, index) => ({
    		url: image.secure_url,
    		isPrimary: index === 0, 
  		}));

		const car = await this.prismaService.car.create({
			data: {
				...carData,
				location: {
					connect: {
						id: locationId,
					},
				},
				images: {
					create: imagesToCreate,
				},
			},
			include: { images: true, location: true },
		});

		return car;
	}

	async update(id: string, dto: UpdateCarDto, files?: { images?: Express.Multer.File[] }): Promise<Car> {
	const car = await this.findOne(id);

    const { locationId, ...carData } = dto;

    let imagesToCreate: { url: string; isPrimary: boolean }[] | undefined;

    if (files?.images && files.images.length > 0) {
        const uploaded = await this.cloudinary.uploadFiles(files.images, 'cars');
        
       await Promise.all(
			car.images.map(async (image) => {
				const publicId = getPublicId(image.url);
				await this.cloudinary.deleteFile(publicId).catch(() => {});
			})
		);

        imagesToCreate = uploaded.map((image, index) => ({
            url: image.secure_url,
            isPrimary: index === 0,
        }));
    }

    const updateData: Prisma.CarUpdateInput = {
        ...carData,
    };

	    if (locationId) {
        const location = await this.prismaService.location.findUnique({
            where: { id: locationId },
        });
        if (!location) {
            throw new NotFoundException('Location not found');
        }

		updateData.location = {
			connect: {
				id: locationId,
			},
		};
    }

    if (imagesToCreate) {
        updateData.images = {
            deleteMany: {},
            create: imagesToCreate,
        };
    }

    return this.prismaService.car.update({
        where: { id },
        data: updateData,
        include: { images: true, location: true },
    });
}

async updateImages(id: string, files: { images: Express.Multer.File[] }): Promise<Car> {
    	 if (!files.images || files.images.length === 0) {
        throw new BadRequestException('No images uploaded');
    }

    const car = await this.findOne(id);

    return await this.prismaService.$transaction(async (prisma) => {
        const uploaded = await this.cloudinary.uploadFiles(files.images, 'cars');
        
        const imagesToCreate = uploaded.map((image, index) => ({
            url: image.secure_url,
            isPrimary: index === 0,
        }));

        await prisma.carImage.deleteMany({ where: { carId: id } });

        const updatedCar = await prisma.car.update({
            where: { id },
            data: {
                images: {
                    create: imagesToCreate,
                },
            },
            include: { images: true, location: true },
        });

        await Promise.all(
			car.images.map(async (image) => {
                const publicId = getPublicId(image.url);
                await this.cloudinary.deleteFile(publicId).catch((err) => {
                });
            })
        );

        return updatedCar;
    });
}

async updateLocation(id: string, locationId: string): Promise<Car> {
    if (!locationId) {
        throw new BadRequestException('locationId is required');
    }
    
    const car = await this.findOne(id);
    
    const location = await this.prismaService.location.findUnique({
        where: { id: locationId },
    });
    
    if (!location) {
        throw new NotFoundException('Location not found');
    }
    
    return this.prismaService.car.update({
        where: { id },
        data: {
            location: { connect: { id: locationId } },
        },
        include: { images: true, location: true },
    });
}

async updateAvailability(id: string, isAvailable: boolean): Promise<Car> {
    if (isAvailable === undefined) {
        throw new BadRequestException('isAvailable is required');
    }
    
    if (typeof isAvailable !== 'boolean') {
        throw new BadRequestException('isAvailable must be a boolean');
    }
    
    await this.findOne(id);
    
    return this.prismaService.car.update({
        where: { id },
        data: { isAvailable },
        include: { images: true, location: true },
    });
}

	async delete(id: string): Promise<boolean> {
		const car = await this.findOne(id);
        
		await Promise.all(
			car.images.map(async (image) => {
				const publicId = getPublicId(image.url);
				await this.cloudinary.deleteFile(publicId).catch(() => {});
			})
		)
		await this.prismaService.car.delete({ where: { id } });
		return true;
	}
}
