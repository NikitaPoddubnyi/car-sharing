import { FuelType, VehicleStatus } from '@/shared/types';
import { GearBox, TyreType } from './types';

export type CreateBikeModel = Omit<
  Bike,
  'id' | 'createdAt' | 'updatedAt' | 'isAvailable' | 'vehicleStatus'
>;

export type UpdateBikeModel = Partial<CreateBikeModel>;

export interface Bike {
  id: string;
  brand: string;
  model: string;
  year: number;

  groundClearance: number;
  engineDisplacement: number;
  engineSize: number;

  emmisionType: string;

  fuelType: FuelType;
  gearBox: GearBox;
  tyreType: TyreType;
  vehicleStatus: VehicleStatus;

  mileage: number;
  abs: string;

  pricePerDay: number;
  pricePerHour: number;

  locationId: string;

  description?: string;
  isAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
}
