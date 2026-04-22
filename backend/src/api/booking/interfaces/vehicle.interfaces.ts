export type CarResult = {
  type: 'car';
  vehicleId: string;
  pricePerHour: number;
  pricePerDay: number;
  locationId: string;
};

export type BikeResult = {
  type: 'bike';
  vehicleId: string;
  pricePerHour: number;
  pricePerDay: number;
  locationId: string;
};

export type VehicleResult = CarResult | BikeResult;
