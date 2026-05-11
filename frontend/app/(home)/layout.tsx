import { Footer } from '@/widgets/ui/footer';
import { NavBlack } from '@/widgets/ui/nav/nav-black';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <title>Drivee - Car Rental</title>
      <NavBlack />
      <main>{children}</main>
    </>
  );
}
