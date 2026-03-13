import { Navbar } from '@/components/layouts/header/Navbar';
import { BottomNavbar } from '@/components/layouts/footer/BottomNavbar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <BottomNavbar />
    </>
  );
}
