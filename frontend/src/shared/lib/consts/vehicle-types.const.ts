export type IVehicleTypes = {
  name: string;
  src: string;
};

export const VehicleTypes: IVehicleTypes[] = [
  {
    name: 'Bike',
    src: '/bikes',
  },
  {
    name: 'Car',
    src: '/cars',
  },
];
