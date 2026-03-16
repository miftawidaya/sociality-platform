'use client';

import { PostDetailContent } from '@/features/post/components/post-detail';
import { PageHeader } from '@/components/layouts/header/PageHeader';

type PostDetailPageClientProps = Readonly<{
  postId: number;
}>;

/**
 * Client wrapper for the direct URL post detail page.
 * Uses the same PostDetailContent component as the modal,
 * but with variant='page' (no close button).
 */
export function PostDetailPageClient({ postId }: PostDetailPageClientProps) {
  return (
    <>
      <PageHeader title='Post' backTo='/' className='md:hidden' />
      <div className='flex w-full justify-center py-6 md:py-12'>
        <PostDetailContent postId={postId} variant='page' />
      </div>
    </>
  );
}
