import { GearBox, TyreType } from './types';

export const GearBoxLabels: Record<GearBox, string> = {
  [GearBox.SPEED_5]: '5',
  [GearBox.SPEED_6]: '6',
  [GearBox.SPEED_7]: '7',
};

export const TyreTypeLabels: Record<TyreType, string> = {
  [TyreType.FLAT]: 'Flat',
  [TyreType.RIM]: 'Rim',
  [TyreType.TUBELESS]: 'Tubeless',
};
