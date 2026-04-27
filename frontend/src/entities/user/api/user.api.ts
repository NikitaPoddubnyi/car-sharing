import { $axios } from '@/shared/api/client';
import { handleAxiosError } from '@/shared/lib/helpers';

export class UserApi {
  static async getAll() {
    try {
      const { data } = await $axios.get('/users');
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  static async getMe() {
    try {
      const { data } = await $axios.get(`/profile`);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
