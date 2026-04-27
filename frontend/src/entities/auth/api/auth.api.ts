import { $axios } from '@/shared/api/client';
import { LoginModel, RegisterModel } from '../models';

export class AuthApi {
  static async login(model: LoginModel) {
    const { data } = await $axios.post('/auth/login', model);

    return data;
  }

  static async register(model: RegisterModel) {
    const { data } = await $axios.post('/auth/register', model);

    return data;
  }

  static async logout() {
    await $axios.post('/auth/logout');
  }
}
