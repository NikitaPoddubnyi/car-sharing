export enum VehicleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  [VehicleStatus.PENDING]: 'Pending',
  [VehicleStatus.APPROVED]: 'Approved',
  [VehicleStatus.REJECTED]: 'Rejected',
};

export const vehicleStatusOptions = Object.entries(VEHICLE_STATUS_LABELS);
