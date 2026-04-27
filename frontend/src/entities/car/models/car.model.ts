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
