import axios, { AxiosInstance } from 'axios';

export const $axios: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
  withCredentials: true,
});

$axios.interceptors.request.use((config) => {
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

$axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
