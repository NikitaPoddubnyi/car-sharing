import { $axios } from '@/shared/api/client';
import { handleAxiosError } from '@/shared/lib/helpers';
import { Car, CreateCarModel, UpdateCarModel } from '../models';

export class CarApi {
  static async create(dto: CreateCarModel): Promise<Car | undefined> {
    try {
      const { data } = await $axios.post<Car>('/cars', dto);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async getAll(): Promise<Car[]> {
    try {
      const { data } = await $axios.get<Car[]>('/cars/all');
      return data;
    } catch (error) {
      handleAxiosError(error);
      return [];
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
