import { GearBox, TyreType } from './types';

export const GearBoxLabels: Record<GearBox, string> = {
  [GearBox.SPEED_5]: '5 Speed',
  [GearBox.SPEED_6]: '6 Speed',
  [GearBox.SPEED_7]: '7 Speed',
};

export const TyreTypeLabels: Record<TyreType, string> = {
  [TyreType.FLAT]: 'Flat',
  [TyreType.RIM]: 'Rim',
  [TyreType.TUBELESS]: 'Tubeless',
};

export const bikeBrands = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW'];

export const gearBoxOptions = Object.entries(GearBoxLabels);
export const tyreTypeOptions = Object.entries(TyreTypeLabels);
