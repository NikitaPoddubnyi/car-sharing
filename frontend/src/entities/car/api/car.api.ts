import { $axios } from '@/shared/api/client';
import { handleAxiosError } from '@/shared/lib/helpers';
import { Car, CarsResponse, CreateCarModel, SearchCarsDto, UpdateCarModel } from '../models';

export class CarApi {
  static async create(dto: CreateCarModel): Promise<Car | undefined> {
    try {
      const { data } = await $axios.post<Car>('/cars', dto);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async findAvailable(dto: SearchCarsDto = {}, page = 1, limit = 2): Promise<CarsResponse> {
    try {
      const { data } = await $axios.get<CarsResponse>('/cars/available', {
        params: {
          ...dto,
          page,
          limit,
        },
      });
      return data;
    } catch (error: any) {
      return { items: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
  }

  static async getOne(id: string): Promise<Car | undefined> {
    try {
      const { data } = await $axios.get<Car>(`/cars/${id}`);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async update(id: string, dto: UpdateCarModel): Promise<Car | undefined> {
    try {
      const { data } = await $axios.patch<Car>(`/cars/${id}`, dto);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await $axios.delete(`/cars/${id}`);
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
