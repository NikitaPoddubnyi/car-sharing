import { BodyType, DriveTrain, Transmission } from './types';

export const DRIVE_TRAIN_LABELS: Record<DriveTrain, string> = {
  [DriveTrain.FWD]: 'Front wheel drive',
  [DriveTrain.RWD]: 'Rear wheel drive',
  [DriveTrain.AWD]: 'All wheel drive',
};

export const TRANSMISSION_LABELS: Record<Transmission, string> = {
  [Transmission.AUTOMATIC]: 'AWT',
  [Transmission.MANUAL]: 'MANUAL',
};

export const Body_TYPE_LABELS: Record<BodyType, string> = {
  [BodyType.SEDAN]: 'Sedan',
  [BodyType.SUV]: 'SUV',
  [BodyType.HATCHBACK]: 'Hatchback',
  [BodyType.COUPE]: 'Coupe',
};

export const carBrands = [
  'Audi',
  'BMW',
  'Chevrolet',
  'Dodge',
  'Ford',
  'Honda',
  'Hyundai',
  'Kia',
  'Lexus',
  'Mazda',
  'Mercedes-Benz',
  'Nissan',
  'Subaru',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

export const driveTrainOptions = Object.entries(DRIVE_TRAIN_LABELS);
export const transmissionOptions = Object.entries(TRANSMISSION_LABELS);
export const bodyTypeOptions = Object.entries(Body_TYPE_LABELS);
