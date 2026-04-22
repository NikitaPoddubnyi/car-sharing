import { Bike, BikeImage, Location } from '@prisma/client';

export type BikeWithDetails = Bike & {
  images: BikeImage[];
  location: Location;
};
