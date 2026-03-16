import React from 'react';
import { cookies } from 'next/headers';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { postApi } from '@/features/post/api/post-api';
import { POST_KEYS } from '@/features/post/hooks/useFeedQuery';
import { FeedClient } from './feed-client';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const isAuthenticated = !!token;

  const queryClient = new QueryClient();

  // Prefetch the first page on the server for SEO and instant FCP
  await queryClient.prefetchInfiniteQuery({
    queryKey: [...POST_KEYS.feed, { limit: 10, isAuthenticated }],
    queryFn: async () => {
      // Direct pass of token enables SSR fetch
      if (isAuthenticated) {
        const feedData = await postApi.getFeed(1, 10, token);
        if (feedData.posts.length > 0) {
          return { ...feedData, source: 'feed' as const };
        }
        // Feed is empty, automatically fallback to explore
      }

      const exploreData = await postApi.getExplorePosts(1, 10, token);
      return { ...exploreData, source: 'explore' as const };
    },
    initialPageParam: {
      source: isAuthenticated ? 'feed' : 'explore',
      page: 1,
    },
  });

  return (
    <div className='bg-background flex min-h-screen flex-col items-center'>
      <main className='md:pb-11xl flex w-full flex-col items-center gap-4 p-4 pb-30 md:gap-6 md:py-10'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <FeedClient isAuthenticated={isAuthenticated} />
        </HydrationBoundary>
      </main>
    </div>
  );
}
