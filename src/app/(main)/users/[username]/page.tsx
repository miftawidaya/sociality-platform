import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { profileApi } from '@/features/profile/api/profile.api';
import { ProfileLayout } from '@/features/profile/components';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { PROFILE_KEYS } from '@/features/profile/queries/profile.keys';

export const dynamic = 'force-dynamic';

type ProfilePageProps = Readonly<{
  params: Promise<{ username: string }>;
}>;

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const queryClient = new QueryClient();

  try {
    const data = await profileApi.getUserProfile(username, token);
    
    // Prefetch User Profile
    queryClient.setQueryData(PROFILE_KEYS.user(username), data);

    return (
      <div className='bg-background flex min-h-screen flex-col items-center'>
        <main className='md:pb-11xl flex w-full flex-col items-center'>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfileLayout data={data} isOwner={false} />
          </HydrationBoundary>
        </main>
      </div>
    );
  } catch (error) {
    console.error(`Failed to load profile for ${username}:`, error);
    notFound();
  }
}
