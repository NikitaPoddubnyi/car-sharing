import { User } from '@/entities/user/models';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuth: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,
      setAuth: (user: User) => {
        set({ isAuth: true, user });
      },
      logout: () => {
        localStorage.removeItem('accessToken');

        set({ isAuth: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
