import { Navbar } from '@/components/layouts/header/Navbar';
import { BottomNavbar } from '@/components/layouts/footer/BottomNavbar';

export default function MainLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      {modal}
      <BottomNavbar />
    </>
  );
}
