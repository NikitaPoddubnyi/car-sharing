export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  HYBRID = 'HYBRID',
  ELECTRIC = 'ELECTRIC',
}

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  [FuelType.PETROL]: 'Petrol',
  [FuelType.DIESEL]: 'Diesel',
  [FuelType.HYBRID]: 'Hybrid',
  [FuelType.ELECTRIC]: 'Electric',
};

export const fuelTypeOptions = Object.entries(FUEL_TYPE_LABELS);
