'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQueryClient } from '@tanstack/react-query';
import {
  AuthPromptDialog,
  type PendingAction,
} from '@/features/auth/components/AuthPromptDialog';
import {
  PostCard,
  PostHeader,
  PostImage,
  PostActions,
  PostContent,
} from '@/features/post/components/post-card';
import {
  useTimelineQuery,
  useLikeMutation,
  useSaveMutation,
  useSavedPostsIdsQuery,
} from '@/features/post/hooks/useFeedQuery';
import { Post } from '@/features/post/types';
import { getRelativeTime } from '@/lib/utils/date';
import { AlertCircle } from 'lucide-react';
import { useShareCounter } from '@/features/post/hooks/useShareCounter';
import { shareContent } from '@/lib/utils/share';

export function FeedClient({
  isAuthenticated,
}: Readonly<{ isAuthenticated: boolean }>) {
  const [authPromptState, setAuthPromptState] = React.useState<{
    open: boolean;
    action: PendingAction | null;
  }>({
    open: false,
    action: null,
  });

  const { ref, inView } = useInView();

  // Prefetch or aggressively fetch saved post IDs in the background to ensure feed mapping works smoothly
  useSavedPostsIdsQuery(isAuthenticated);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useTimelineQuery(10, isAuthenticated);

  const { mutate: mutateLike } = useLikeMutation();
  const { mutate: mutateSave } = useSaveMutation();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const queryClient = useQueryClient();

  // Recover pending action on successful login mount
  useEffect(() => {
    if (!isAuthenticated) return;
    const storedAction = sessionStorage.getItem('pendingAuthAction');
    if (storedAction) {
      try {
        const parsed = JSON.parse(storedAction) as PendingAction;
        sessionStorage.removeItem('pendingAuthAction');
        if (parsed.action === 'like') {
          mutateLike({ postId: parsed.postId, action: 'like' });
        } else if (parsed.action === 'save') {
          mutateSave({ postId: parsed.postId, action: 'save' });
        }
      } catch (e) {
        console.error('Failed to parse pending auth action', e);
      }
    }
  }, [isAuthenticated, mutateLike, mutateSave]);

  const handleLikeToggle = (post: Post) => {
    if (!isAuthenticated) {
      setAuthPromptState({
        open: true,
        action: { action: 'like', postId: post.id },
      });
      return;
    }

    mutateLike({
      postId: post.id,
      action: post.likedByMe ? 'unlike' : 'like',
    });
  };

  const handleSaveToggle = (post: Post) => {
    if (!isAuthenticated) {
      setAuthPromptState({
        open: true,
        action: { action: 'save', postId: post.id },
      });
      return;
    }

    const savedIds = queryClient.getQueryData<Set<number>>([
      'feed',
      'savedIds',
    ]);
    const isCurrentlySaved = savedIds?.has(post.id) || post.saved;
    const action = isCurrentlySaved ? 'unsave' : 'save';

    console.log(
      `[FeedClient] handleSaveToggle for ${post.id}. State in cache: ${savedIds?.has(post.id)}, Action: ${action}`
    );

    mutateSave({
      postId: post.id,
      action: action,
    });
  };

  // Content state rendering
  const renderContent = () => {
    if (isLoading) return <FeedSkeleton />;

    if (isError) {
      return (
        <div className='text-destructive flex flex-col items-center justify-center p-8 text-center'>
          <AlertCircle className='mb-2 size-8' />
          <p className='text-md-medium'>Failed to load feed</p>
          <p className='text-sm-regular text-muted-foreground'>
            {error?.message || 'Please check your connection.'}
          </p>
        </div>
      );
    }

    const firstPagePosts = data?.pages[0]?.posts || [];
    if (firstPagePosts.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <p className='text-md-medium text-foreground'>No posts yet</p>
          <p className='text-sm-regular text-muted-foreground'>
            Check back later or follow more people to see their updates here!
          </p>
        </div>
      );
    }

    return data?.pages.map((page) => (
      <TimelinePage
        key={`${page.source}-${page.pagination.page}`}
        page={page}
        onLike={handleLikeToggle}
        onSave={handleSaveToggle}
      />
    ));
  };

  // Infinite scroll status rendering
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <div className='border-primary h-6 w-6 animate-spin rounded-full border-t-2 border-r-2 transition-all' />
      );
    }

    if (hasNextPage) {
      return (
        <p className='text-sm-regular text-muted-foreground'>Scroll for more</p>
      );
    }

    const hasAnyPosts = (data?.pages[0]?.posts || []).length > 0;
    if (!isLoading && !isError && hasAnyPosts) {
      return (
        <p className='text-sm-regular text-muted-foreground'>
          You have reached the end
        </p>
      );
    }

    return null;
  };

  return (
    <>
      {renderContent()}

      {/* Loading Indicator for Infinite Scroll */}
      <div ref={ref} className='flex w-full items-center justify-center py-8'>
        {renderFooter()}
      </div>

      <AuthPromptDialog
        open={authPromptState.open}
        onClose={() => setAuthPromptState({ open: false, action: null })}
        pendingAction={authPromptState.action}
      />
    </>
  );
}

/**
 * Sub-components to keep nesting depth within limits
 */
function TimelinePage({
  page,
  onLike,
  onSave,
}: Readonly<{
  page: any;
  onLike: (post: Post) => void;
  onSave: (post: Post) => void;
}>) {
  return (
    <React.Fragment>
      {(page.posts || []).map((post: Post) => (
        <PostItem key={post.id} post={post} onLike={onLike} onSave={onSave} />
      ))}
    </React.Fragment>
  );
}

function PostItem({
  post,
  onLike,
  onSave,
}: Readonly<{
  post: Post;
  onLike: (post: Post) => void;
  onSave: (post: Post) => void;
}>) {
  const timestamp = getRelativeTime(post.createdAt);
  const { count: sharesCount, increment: incrementShare } = useShareCounter(
    post.id
  );

  const handleShare = async () => {
    const shareData: ShareData = {
      title: `Step by ${post.author.username}`,
      text: post.caption,
      url: `${globalThis.location.origin}/posts/${post.id}`,
    };

    const success = await shareContent(shareData);
    if (success) {
      incrementShare();
    }
  };

  return (
    <PostCard postId={post.id.toString()}>
      <PostHeader
        username={post.author.username}
        timestamp={timestamp}
        avatarUrl={post.author.avatarUrl || undefined}
      />

      <PostImage
        imageUrl={post.imageUrl}
        altText={`Post by ${post.author.username}`}
      />

      <PostActions
        likesCount={post.likeCount}
        commentsCount={post.commentCount}
        sharesCount={sharesCount}
        isLiked={post.likedByMe}
        isSaved={post.saved || false}
        postId={post.id}
        onLike={() => onLike(post)}
        onSave={() => onSave(post)}
        onShare={handleShare}
      />

      <PostContent username={post.author.username} content={post.caption} />
    </PostCard>
  );
}

// Simple Skeleton for Initial Load
function FeedSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='border-border flex w-full max-w-91 animate-pulse flex-col gap-2 border-b pb-4 md:max-w-150 md:gap-3'
        >
          <div className='flex w-full items-center gap-3'>
            <div className='bg-muted size-11 rounded-full md:size-16'></div>
            <div className='flex w-full max-w-37.5 flex-col gap-2'>
              <div className='bg-muted h-4 rounded'></div>
              <div className='bg-muted h-3 w-2/3 rounded'></div>
            </div>
          </div>
          <div className='bg-muted aspect-square w-full rounded-lg'></div>
          <div className='flex h-7 w-full justify-between md:h-7.5'>
            <div className='flex gap-4'>
              <div className='bg-muted h-6 w-12 rounded'></div>
              <div className='bg-muted h-6 w-12 rounded'></div>
            </div>
            <div className='bg-muted h-6 w-8 rounded'></div>
          </div>
          <div className='mt-2 flex flex-col gap-2'>
            <div className='bg-muted h-4 w-full rounded'></div>
            <div className='bg-muted h-4 w-4/5 rounded'></div>
          </div>
        </div>
      ))}
    </>
  );
}
