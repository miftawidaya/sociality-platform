import { DevDashboard } from '@/features/dev/components/DevDashboard';
import { Navbar } from '@/components/layouts/header/Navbar';

import { PageHeader } from '@/components/layouts/header/PageHeader';

/**
 * Dev Page
 *
 * Simple route that renders the DevDashboard component.
 */
export default function Page() {
  return (
    <>
      <Navbar className='hidden md:block' />
      <PageHeader title='Developer' className='md:hidden' />
      <DevDashboard />
    </>
  );
}
