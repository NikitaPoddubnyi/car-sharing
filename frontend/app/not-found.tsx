import { NavWhite } from '@/widgets/ui/nav/nav-white';

export default function NotFound() {
  return (
    <>
      <NavWhite />
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white!">
        <h1 className="text-3xl font-bold">Page not found!</h1>
      </main>
    </>
  );
}
