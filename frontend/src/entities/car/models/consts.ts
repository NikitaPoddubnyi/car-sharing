import { DriveTrain, Transmission } from './types';

export const DRIVE_TRAIN_LABELS: Record<DriveTrain, string> = {
  [DriveTrain.FWD]: 'Front wheel drive',
  [DriveTrain.RWD]: 'Rear wheel drive',
  [DriveTrain.AWD]: 'All wheel drive',
};

export const TRANSMISSION_LABELS: Record<Transmission, string> = {
  [Transmission.AUTOMATIC]: 'Automatic',
  [Transmission.MANUAL]: 'Manual',
};
