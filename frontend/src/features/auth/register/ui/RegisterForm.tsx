import { AuthApi } from '@/entities/auth/api/auth.api';
import { RegisterFormData, registerSchema } from '@/entities/auth/models';
import { useAuth } from '@/entities/auth/stores/auth.store';
import { UserApi } from '@/entities/user/api/user.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterForm(): JSX.Element {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    try {
      const res = await AuthApi.register(data);

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      RegisterForm
    </main>
  );
}
