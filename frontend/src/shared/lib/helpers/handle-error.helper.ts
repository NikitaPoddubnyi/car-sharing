import { AxiosError } from 'axios';

export const handleAxiosError = (error: unknown): void => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return;
    }

    throw new Error(error.response?.data?.message || error.message);
  }

  throw new Error('Unknown error');
};
