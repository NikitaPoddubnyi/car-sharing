import { NavWhite } from '@/widgets/ui/nav/nav-white';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavWhite />
      <main>{children}</main>
    </>
  );
}
