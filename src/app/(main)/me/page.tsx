import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { profileApi } from '@/features/profile/api/profile.api';
import { ProfileLayout } from '@/features/profile/components';
import { ROUTES } from '@/config/routes';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { PROFILE_KEYS } from '@/features/profile/queries/profile.keys';

export const dynamic = 'force-dynamic';

export default async function MyProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect(ROUTES.LOGIN);
  }

  const queryClient = new QueryClient();

  try {
    const data = await profileApi.getMyProfile(token);
    
    // Prefetch My Profile
    queryClient.setQueryData(PROFILE_KEYS.me(), data);

    return (
      <div className='bg-background flex min-h-screen flex-col items-center'>
        <main className='md:pb-11xl flex w-full flex-col items-center'>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfileLayout data={data} isOwner={true} />
          </HydrationBoundary>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Failed to load profile:', error);
    redirect(ROUTES.LOGIN);
  }
}
