import { cookies } from 'next/headers';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { postApi } from '@/features/post/api/post-api';
import { PostDetailPageClient } from './post-detail-page-client';

type PostPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export const dynamic = 'force-dynamic';

/**
 * Direct URL post detail page (server component).
 * Prefetches post data for SEO and instant FCP.
 * Renders the same PostDetailContent as the modal,
 * but without close button and in full-page layout.
 */
export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', 'detail', postId],
    queryFn: () => postApi.getPostById(postId, undefined, token),
  });

  return (
    <div className='bg-background flex min-h-screen flex-col items-center py-6 md:py-12'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostDetailPageClient postId={postId} />
      </HydrationBoundary>
    </div>
  );
}
