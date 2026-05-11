'use client';
import { AuthApi } from '@/entities/auth/api/auth.api';
import { RegisterFormData, registerSchema } from '@/entities/auth/models';
import { useAuth } from '@/entities/auth/stores/auth.store';
import { UserApi } from '@/entities/user/api/user.api';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm(): JSX.Element {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...dataToSend } = data;
    setServerError(null);

    try {
      const res = await AuthApi.register(dataToSend);
      localStorage.setItem('accessToken', res.accessToken);
      const user = await UserApi.getMe();
      setAuth(user);
      router.push('/');
    } catch (e: any) {
      const message =
        e.response?.data?.message || e.response?.data?.error || 'Something went wrong';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <div className="max-w-120 mx-auto! my-20! flex flex-col justify-center">
      <h1 className="text-4xl font-black text-center text-gray-900 mb-6!">Drivee</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3!">Create an account.</h2>
      <p className="text-sm text-gray-400 mb-8!">
        We'd love to have you on board. Join over 500+ customers around the globe and enhance
        productivity.
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1!">
            First Name <span className="text-black">*</span>
          </label>
          <input
            type="text"
            placeholder="First Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1!">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1!">
            Last Name <span className="text-black">*</span>
          </label>
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1!">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1!">
            Email <span className="text-black">*</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            {...register('email')}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1!">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1!">
            Password <span className="text-black">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            {...register('password')}
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
          <div className="text-xs text-gray-500 mt-1! space-y-0.5">
            <p className={errors.password ? 'text-red-400' : ''}>• At least 6 characters</p>
            <p className={errors.password ? 'text-red-400' : ''}>
              • At least one uppercase & one lowercase letter
            </p>
            <p className={errors.password ? 'text-red-400' : ''}>• At least one number</p>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1!">
            Confirm Password <span className="text-black">*</span>
          </label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-md px-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500 hover:text-black"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1!">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-400 text-red-600 text-sm px-3 py-2 rounded-md">
            {serverError}
          </div>
        )}

        <button
          className="w-full bg-black text-white font-medium py-3 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6!">
        Have an account?{' '}
        <Link
          href="/login"
          className="text-black! hover:text-gray-700! hover:underline! font-medium underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
