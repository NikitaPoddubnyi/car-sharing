import { FuelType, VehicleStatus } from '@/shared/types';
import { BodyType, DriveTrain, Transmission } from './types';

export type CreateCarModel = Omit<
  Car,
  'id' | 'createdAt' | 'updatedAt' | 'isAvailable' | 'vehicleStatus'
>;

export type UpdateCarModel = Partial<CreateCarModel>;

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;

  images: Images[];

  bodyType: BodyType;
  seats: number;
  doors: number;
  luggage: number;

  transmission: Transmission;
  driveTrain: DriveTrain;
  fuelType: FuelType;
  vehicleStatus: VehicleStatus;

  engineSize: number;
  mileage: number;

  pricePerDay: number;
  pricePerHour: number;

  locationId: string;
  description?: string;

  isAvailable: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface SearchCarsDto {
  locationId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  bodyType?: BodyType;
  transmission?: Transmission;
  driveTrain?: DriveTrain;
  fuelType?: FuelType;
  brand?: string;
  seats?: number;
  minPrice?: number;
  maxPrice?: number;
  priceSort?: 'asc' | 'desc';
  timeDuration?: 'hour' | 'day';
}

export interface Images {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface CarsResponse {
  items: Car[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
