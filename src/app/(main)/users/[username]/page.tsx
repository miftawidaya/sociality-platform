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
    const rawData = await profileApi.getUserProfile(username, token);
    
    // Map public profile data to match ProfileResponse expected by ProfileLayout
    const data = {
      profile: {
        id: (rawData as any).id,
        name: (rawData as any).name,
        username: (rawData as any).username,
        email: (rawData as any).email,
        phone: (rawData as any).phone,
        bio: (rawData as any).bio,
        avatarUrl: (rawData as any).avatarUrl,
        isFollowedByMe: (rawData as any).isFollowing,
      },
      stats: {
        posts: (rawData as any).counts?.post || 0,
        followers: (rawData as any).counts?.followers || 0,
        following: (rawData as any).counts?.following || 0,
        likes: (rawData as any).counts?.likes || 0,
      }
    };
    
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
