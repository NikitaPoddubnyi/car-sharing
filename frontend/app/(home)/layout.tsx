import { NavBlack } from '@/widgets/ui/nav/nav-black';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBlack />
      <main>{children}</main>
    </>
  );
}
