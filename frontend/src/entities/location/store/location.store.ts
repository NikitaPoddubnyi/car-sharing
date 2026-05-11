import { create } from 'zustand';
import { LocationApi } from '@/entities/location/api';
import { Location } from '@/entities/location/models';

interface LocationStore {
  locations: Location[];
  isLoading: boolean;
  fetchLocations: () => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  isLoading: false,
  fetchLocations: async () => {
    set({ isLoading: true });
    try {
      const data = await LocationApi.getAll();
      set({ locations: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      set({ locations: [], isLoading: false });
    }
  },
}));
