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
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setAuth } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      router.push('/');
    }
  }, [router]);

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
    <div className="max-w-120 mx-auto! my-20! flex flex-col">
      <h1 className="text-4xl font-black text-center text-gray-900 mb-6!">Drivee</h1>

      <h2 className="text-2xl font-bold text-gray-900 mb-3!">Sign In.</h2>
      <p className="text-sm text-gray-400 mb-8!">
        We'd love to have you on board. Join over 500+ customers around the globe and enhance
        productivity.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1!">
            Email<span className="text-black">*</span>
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1!">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1!">
            Password<span className="text-black">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500 hover:text-black transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1!">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-400 text-red-600 text-sm px-3 py-2 rounded-md">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-medium py-3 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {isSubmitting ? 'Loading...' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6!">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="text-black! hover:text-gray-500! hover:underline! font-medium underline"
        >
          Register here.
        </Link>
      </p>
    </div>
  );
}
