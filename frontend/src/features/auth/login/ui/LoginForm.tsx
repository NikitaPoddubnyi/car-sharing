'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '@/entities/auth/models';
import { AuthApi } from '@/entities/auth/api/auth.api';
import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/stores/auth.store';
import { UserApi } from '@/entities/user/api/user.api';
import { User } from '@/entities/user/models';

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const res = await AuthApi.login(data);

      localStorage.setItem('accessToken', res.accessToken);

      const user: User = await UserApi.getMe();
      setAuth(user);
      router.push('/');
    } catch (e: any) {
      const message =
        e.response?.data?.message || e.response?.data?.error || 'Something went wrong';

      setServerError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full border rounded-lg p-2" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full border rounded-lg p-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* SERVER ERROR */}
          {serverError && (
            <div className="bg-red-50 border border-red-500 text-red-700 p-2 rounded">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white p-2 rounded-lg disabled:bg-gray-400"
          >
            {isSubmitting ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
