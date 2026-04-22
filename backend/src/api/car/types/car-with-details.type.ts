import { Car, CarImage, Location } from '@prisma/client';

export type CarWithDetails = Car & { images: CarImage[]; location: Location };
