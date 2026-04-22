import { BadRequestException } from '@nestjs/common';
import { Bike, BikeImage } from '@prisma/client';
import { validate } from 'class-validator';
import { getPublicId } from 'src/common/helpers';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';

export async function deleteImagesFromCloudinary(
  cloudinary: CloudinaryService,
  images: BikeImage[],
): Promise<void> {
  await Promise.allSettled(
    images.map((image) => cloudinary.deleteFile(getPublicId(image.url))),
  );
}

export function prepareImagesData(uploaded: { secure_url: string }[]): {
  url: string;
  isPrimary: boolean;
}[] {
  return uploaded.map((image, index) => ({
    url: image.secure_url,
    isPrimary: index === 0,
  }));
}

export function validateBikeUniqueness(
  existingBike: Bike | null,
  brand: string,
  model: string,
  year: number,
  mileage: number,
): void {
  if (existingBike) {
    throw new BadRequestException(
      `You already have a bike with the same brand (${brand}), model (${model}), year (${year}) and mileage (${mileage})`,
    );
  }
}
