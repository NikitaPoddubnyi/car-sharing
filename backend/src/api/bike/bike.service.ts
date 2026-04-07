import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateBikeDto, UpdateBikeDto } from './dto';
import { Bike, BikeImage, Location, Prisma } from '@prisma/client';
import { getPublicId } from 'src/common/helpers';

@Injectable()
export class BikeService {
	constructor(private readonly prismaService: PrismaService,
		private readonly cloudinary: CloudinaryService
	) {}
		async findAll(): Promise<Bike[]> {
			return await this.prismaService.bike.findMany({
				include: { images: true, location: true }
			});
		}
	
		async findOne(id: string): Promise<Bike & { images: BikeImage[]; location: Location }> {
			const bike = await this.prismaService.bike.findUnique({
				where: { id },
				include: { images: true, location: true }
			});
	
			if (!bike) throw new NotFoundException('Bike not found');
			return bike;
		}
	
		async create(dto: CreateBikeDto, files: { images: Express.Multer.File[]}): Promise<Bike> {
			const { locationId, ...bikeData } = dto;
	
			const location = await this.prismaService.location.findUnique({
				where: { id: locationId },
			});
	
			if (!location) {
				throw new NotFoundException('Location not found');
			}
	
			const uploaded = await this.cloudinary.uploadFiles(files.images, "bikes");
	
			if (!uploaded || uploaded.length === 0) {
				throw new BadRequestException('No images uploaded');
			}
	
			const imagesToCreate = uploaded.map((image, index) => ({
				url: image.secure_url,
				isPrimary: index === 0, 
			}));
	
			const bike = await this.prismaService.bike.create({
				data: {
					...bikeData,
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
	
			return bike;
		}

		async update(id: string, dto: UpdateBikeDto, files?: { images?: Express.Multer.File[]}): Promise<Bike> {
			const bike = await this.findOne(id);
			const { locationId, ...bikeData } = dto;

			let imagesToCreate: { url: string; isPrimary: boolean }[] | undefined;

			if (files?.images && files.images.length > 0) {
				const uploaded = await this.cloudinary.uploadFiles(files.images, "bikes");

				await	Promise.all(
					bike.images.map(async (image) => {
						const publicId = getPublicId(image.url);
						await this.cloudinary.deleteFile(publicId).catch(() => {});
					})
				);

				imagesToCreate = uploaded.map((image, index) => ({
					url: image.secure_url,
					isPrimary: index === 0,
				}));
			}

			const updatedData: Prisma.BikeUpdateInput = {
				...bikeData,
			}

			if (locationId) {
    			const location = await this.prismaService.location.findUnique({
        		where: { id: locationId },
    		});
    			if (!location) throw new NotFoundException('Location not found');
    			updatedData.location = { connect: { id: locationId } };
			}

			if (imagesToCreate) {
				updatedData.images = {
					deleteMany: {},
					create: imagesToCreate,
				};
			}

			return this.prismaService.bike.update({
				where: { id },
				data: updatedData,
				include: { images: true, location: true },
			});
		}

async updateImages(id: string, files: { images: Express.Multer.File[] }): Promise<Bike> {

    if (!files.images || files.images.length === 0) {
        throw new BadRequestException('No images uploaded');
    }

    const bike = await this.findOne(id);

    return await this.prismaService.$transaction(async (prisma) => {
        const uploaded = await this.cloudinary.uploadFiles(files.images, 'bikes');
        
        const imagesToCreate = uploaded.map((image, index) => ({
            url: image.secure_url,
            isPrimary: index === 0,
        }));

        await prisma.bikeImage.deleteMany({ where: { bikeId: id } });

        const updatedBike = await prisma.bike.update({
            where: { id },
            data: {
                images: {
                    create: imagesToCreate,
                },
            },
            include: { images: true, location: true },
        });

        await Promise.all(
            bike.images.map(async (image) => {
                const publicId = getPublicId(image.url);
                await this.cloudinary.deleteFile(publicId).catch((err) => {
                });
            })
        );

        return updatedBike;
    });
}
	
	async updateLocation(id: string, locationId: string): Promise<Bike> {
		if (!locationId) {
			throw new BadRequestException('locationId is required');
		}
		
		const bike = await this.findOne(id);
		
		const location = await this.prismaService.location.findUnique({
			where: { id: locationId },
		});
		
		if (!location) {
			throw new NotFoundException('Location not found');
		}
		
		return this.prismaService.bike.update({
			where: { id },
			data: {
				location: { connect: { id: locationId } },
			},
			include: { images: true, location: true },
		});
	}
	
	async updateAvailability(id: string, isAvailable: boolean): Promise<Bike> {
		if (isAvailable === undefined) {
			throw new BadRequestException('isAvailable is required');
		}
		
		if (typeof isAvailable !== 'boolean') {
			throw new BadRequestException('isAvailable must be a boolean');
		}
		
		await this.findOne(id);
		
		return this.prismaService.bike.update({
			where: { id },
			data: { isAvailable },
			include: { images: true, location: true },
		});
	}
	
		async delete(id: string): Promise<boolean> {
			const bike = await this.findOne(id);
			
			await Promise.all(
				bike.images.map(async (image) => {
					const publicId = getPublicId(image.url);
					await this.cloudinary.deleteFile(publicId).catch(() => {});
				})
			)
			
			await this.prismaService.bike.delete({ where: { id } });
			return true;
		}
	}
