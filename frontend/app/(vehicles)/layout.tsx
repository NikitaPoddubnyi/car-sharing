import { NavBlack } from '@/widgets/ui/nav/nav-black';
import { NavWhite } from '@/widgets/ui/nav/nav-white';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavWhite />
      <main>{children}</main>
    </>
  );
}
