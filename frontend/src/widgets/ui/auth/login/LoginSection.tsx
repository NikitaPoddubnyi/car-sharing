import { LoginForm } from '@/features/auth/login/ui';
import { VideoComponent } from '@/shared/ui/components/auth';

export default function LoginSection() {
  return (
    <section className="w-full flex min-h-screen">
      <div className="w-1/2">
        <VideoComponent />
      </div>
      <div className="w-1/2 shrink-0 bg-white!">
        <LoginForm />
      </div>
    </section>
  );
}
