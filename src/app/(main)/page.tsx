import React from 'react';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { postApi } from '@/features/post/api/post-api';
import { POST_KEYS } from '@/features/post/hooks/useFeedQuery';
import { FeedClient } from './feed/feed-client';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const queryClient = new QueryClient();

  // Prefetch explore posts for SEO and instant FCP for public users
  await queryClient.prefetchInfiniteQuery({
    queryKey: [...POST_KEYS.feed, { limit: 10, isAuthenticated: false }],
    queryFn: async () => {
      const exploreData = await postApi.getExplorePosts(1, 10);
      return { ...exploreData, source: 'explore' as const };
    },
    initialPageParam: {
      source: 'explore',
      page: 1,
    },
  });

  return (
    <div className='bg-background flex min-h-screen flex-col items-center'>
      <main className='md:pb-11xl flex w-full flex-col items-center gap-4 p-4 pb-30 md:gap-6 md:py-10'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <FeedClient isAuthenticated={false} />
        </HydrationBoundary>
      </main>
    </div>
  );
}
