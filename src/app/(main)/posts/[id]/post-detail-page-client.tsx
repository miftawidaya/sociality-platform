'use client';

import { PostDetailContent } from '@/features/post/components/post-detail';

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
    <PostDetailContent
      postId={postId}
      variant='page'
    />
  );
}
