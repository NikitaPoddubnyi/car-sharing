export type IVehicleTypes = {
  name: string;
  src: string;
};

export const vehicleTypes: IVehicleTypes[] = [
  {
    name: 'Bike',
    src: '/bikes',
  },
  {
    name: 'Car',
    src: '/cars',
  },
];
