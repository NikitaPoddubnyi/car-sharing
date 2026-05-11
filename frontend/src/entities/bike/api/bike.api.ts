import { $axios } from '@/shared/api/client';
import { CreateBikeModel, Bike, UpdateBikeModel, SearchBikesDto, BikesResponse } from '../models';
import { handleAxiosError } from '@/shared/lib/helpers';

export class BikeApi {
  static async create(dto: CreateBikeModel): Promise<Bike | undefined> {
    try {
      const { data } = await $axios.post<Bike>('/bikes', dto);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async getOne(id: string): Promise<Bike | undefined> {
    try {
      const { data } = await $axios.get<Bike>(`/bikes/${id}`);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async findAvailable(
    dto: SearchBikesDto = {},
    page = 1,
    limit = 20
  ): Promise<BikesResponse> {
    try {
      const { data } = await $axios.get<BikesResponse>('/bikes/available', {
        params: { ...dto, page, limit },
      });
      return data;
    } catch (error) {
      return { items: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
  }

  static async update(id: string, dto: UpdateBikeModel): Promise<Bike | undefined> {
    try {
      const { data } = await $axios.patch<Bike>(`/bikes/${id}`, dto);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await $axios.delete(`/bikes/${id}`);
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
