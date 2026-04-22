import { BookingStatus, Car, CarImage } from '@prisma/client';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { getPublicId } from 'src/common/helpers';
import { BadRequestException } from '@nestjs/common';

export async function deleteImagesFromCloudinary(
  cloudinary: CloudinaryService,
  images: CarImage[],
): Promise<void> {
  await Promise.allSettled(
    images.map((image) => cloudinary.deleteFile(getPublicId(image.url))),
  );
}

export function prepareImagesData(
  uploaded: { secure_url: string }[],
): { url: string; isPrimary: boolean }[] {
  return uploaded.map((img, i) => ({
    url: img.secure_url,
    isPrimary: i === 0,
  }));
}

export function validateCarUniqueness(
  existingCar: Car | null,
  brand: string,
  model: string,
  year: number,
  mileage: number,
): void {
  if (existingCar) {
    throw new BadRequestException(
      `You already have a car with the same brand (${brand}), model (${model}), year (${year}) and mileage (${mileage})`,
    );
  }
}
