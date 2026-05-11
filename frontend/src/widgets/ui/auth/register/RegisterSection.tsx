import { LoginForm } from '@/features/auth/login/ui';
import { RegisterForm } from '@/features/auth/register/ui';
import { VideoComponent } from '@/shared/ui/components/auth';

export default function RegisterSection() {
  return (
    <section className="w-full flex min-h-screen">
      <div className="w-1/2">
        <VideoComponent />
      </div>
      <div className="w-1/2 bg-white!">
        <RegisterForm />
      </div>
    </section>
  );
}
