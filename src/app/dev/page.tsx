import { DevDashboard } from '@/components/dev/DevDashboard';
import { Navbar } from '@/components/layout/Navbar';

import { PageHeader } from '@/components/layout/PageHeader';

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
