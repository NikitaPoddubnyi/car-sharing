import { FuelType, VehicleStatus } from '@/shared/types';
import { GearBox, TyreType } from './types';

export type CreateBikeModel = Omit<
  Bike,
  'id' | 'createdAt' | 'updatedAt' | 'isAvailable' | 'vehicleStatus'
>;

export type UpdateBikeModel = Partial<CreateBikeModel>;

interface Images {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Bike {
  id: string;
  brand: string;
  model: string;
  year: number;

  images: Images[];

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

export interface SearchBikesDto {
  locationId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  fuelType?: FuelType;
  brand?: string;
  model?: string;
  tyreType?: TyreType;
  gearBox?: GearBox;
  minPrice?: number;
  maxPrice?: number;
  priceSort?: 'asc' | 'desc';
  timeDuration?: 'hour' | 'day';
}

export interface BikesResponse {
  items: Bike[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
