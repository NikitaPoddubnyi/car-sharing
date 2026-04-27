import { $axios } from '@/shared/api/client';
import { Location } from '../models';
import { handleAxiosError } from '@/shared/lib/helpers';

export class LocationApi {
  static async getAll(): Promise<Location[]> {
    try {
      const { data } = await $axios.get<Location[]>('/locations/all');
      return data;
    } catch (error) {
      handleAxiosError(error);
      return [];
    }
  }
}
