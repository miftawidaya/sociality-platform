'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { AlertCircle, MoreHorizontal } from 'lucide-react';
import {
  usePostDetailQuery,
  useCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '../../hooks/usePostDetailQuery';
import { useQueryClient } from '@tanstack/react-query';
import {
  AuthPromptDialog,
  type PendingAction,
} from '@/features/auth/components/AuthPromptDialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useLikeMutation,
  useSaveMutation,
  useSavedPostsIdsQuery,
} from '../../hooks/useFeedQuery';
import { PostActions } from '../post-card/PostActions';
import { CommentsList } from './CommentsList';
import { CommentComposer } from './CommentComposer';
import { PostDetailSkeleton } from './PostDetailSkeleton';
import { getRelativeTime } from '@/lib/utils/date';
import type { Comment } from '../../types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { shareContent } from '@/lib/utils/share';
import { useShareCounter } from '../../hooks/useShareCounter';

type PostDetailContentProps = Readonly<{
  postId: number;
  /** modal = rendered inside overlay; page = direct URL full page */
  variant: 'modal' | 'page';
  className?: string;
}>;

/**
 * Reusable post detail content. Same component renders in both
 * the intercepting route modal and the direct URL page.
 */
export function PostDetailContent({
  postId,
  variant,
  className,
}: PostDetailContentProps) {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [authPromptState, setAuthPromptState] = React.useState<{
    open: boolean;
    action: PendingAction | null;
  }>({
    open: false,
    action: null,
  });

  // Ensure the saved-posts background cache is hot for standalone page visits
  useSavedPostsIdsQuery(isAuthenticated);

  const queryClient = useQueryClient();

  const { data: postResponse, isLoading, isError } = usePostDetailQuery(postId);
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommentsQuery(postId);

  const { mutate: createComment } = useCreateCommentMutation(postId);
  const { mutate: deleteComment } = useDeleteCommentMutation(postId);

  const handleCreateComment = (content: string) => {
    createComment({
      content,
      tempId: -Date.now(),
      author: user
        ? {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
          }
        : undefined,
    });
    // Jump to top to see newest comment immediately
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleRetry = (comment: Comment) => {
    createComment({
      content: comment.text,
      tempId: comment.id,
      author: comment.author,
    });
  };
  const { mutate: mutateLike } = useLikeMutation();
  const { mutate: mutateSave } = useSaveMutation();

  const { count: sharesCount, increment: incrementShare } =
    useShareCounter(postId);

  React.useEffect(() => {
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

  const isPageVariant = variant === 'page';

  if (isLoading) {
    return (
      <div className={cn('flex w-full items-center justify-center', className)}>
        <PostDetailSkeleton variant={variant} />
      </div>
    );
  }

  if (isError || !postResponse?.data) {
    return (
      <div className='text-destructive flex flex-col items-center justify-center p-8 text-center'>
        <AlertCircle className='mb-2 size-8' />
        <p className='text-md-medium'>Failed to load post</p>
      </div>
    );
  }

  const post = postResponse.data;
  const timestamp = getRelativeTime(post.createdAt);

  const allComments: Comment[] = [];
  if (commentsData?.pages) {
    for (const page of commentsData.pages) {
      const pageData = page as { data?: { comments?: Comment[] } };
      const comments = pageData?.data?.comments;
      if (comments) {
        allComments.push(...comments);
      }
    }
  }

  const handleLike = () => {
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

  const handleSave = () => {
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
      `[PostDetail] handleSave for ${post.id}. State in cache: ${savedIds?.has(post.id)}, Action: ${action}`
    );

    mutateSave({
      postId: post.id,
      action: action,
    });
  };

  const handleShare = async () => {
    const shareData: ShareData = {
      title: `Step by ${post.author.username}`,
      text: post.caption,
      url: globalThis.location.href,
    };

    const success = await shareContent(shareData);
    if (success) {
      incrementShare();
    }
  };

  return (
    <>
      <div className='flex h-full w-full items-center justify-center'>
        <motion.div
          layout
          initial={false}
          transition={{
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1],
          }}
          className={cn(
            'bg-card flex w-full overflow-hidden',
            'flex-col md:w-fit md:flex-row',
            'h-full min-h-0 md:h-[calc(100vh-6rem)] md:max-h-192',
            isPageVariant &&
              'md:border-border pb-24 md:rounded-lg md:border md:pb-0',
            className
          )}
        >
          {/* Image Section */}
          <img
            src={post.imageUrl}
            alt={`Post by ${post.author.username}`}
            className={cn(
              'shrink bg-black object-contain',
              'h-[50vh] w-full md:h-full md:w-auto',
              'md:max-w-[calc(100vw-25rem-4rem)] lg:max-w-200'
            )}
          />

          {/* Content Section */}
          <div className='flex w-full shrink-0 flex-col md:w-(--post-detail-content-width)'>
            {/* Fixed Header Area */}
            <div className='p-4 pb-2 md:p-5 md:pb-2'>
              <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center gap-3'>
                  <a href={`/users/${post.author.username}`}>
                    <Avatar className='size-10'>
                      {post.author.avatarUrl && (
                        <AvatarImage
                          src={post.author.avatarUrl}
                          alt={`${post.author.username} avatar`}
                          className='object-cover'
                        />
                      )}
                      <AvatarFallback className='text-sm-bold uppercase'>
                        {post.author.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </a>

                  <div className='flex flex-col'>
                    <a
                      href={`/users/${post.author.username}`}
                      className='text-foreground hover:underline'
                    >
                      <span className='text-sm-bold tracking-[-0.01em]'>
                        {post.author.username}
                      </span>
                    </a>
                    <time
                      suppressHydrationWarning
                      className='text-muted-foreground text-xs-regular'
                    >
                      {timestamp}
                    </time>
                  </div>
                </div>

                <button
                  type='button'
                  aria-label='More options'
                  className='text-foreground cursor-pointer'
                >
                  <MoreHorizontal className='size-6' />
                  <span className='sr-only'>More options</span>
                </button>
              </div>
            </div>

            {/* Scrollable Middle Area (Caption + Comments) */}
            <div
              ref={scrollRef}
              className='flex min-h-0 grow flex-col gap-4 overflow-y-auto px-4 pb-4 md:px-5 md:pb-5'
            >
              {/* Caption moved here so it scrolls away with comments */}
              <p className='text-foreground border-border text-sm-regular border-b pb-4 leading-7 tracking-[-0.02em]'>
                {post.caption}
              </p>

              <CommentsList
                comments={allComments}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={() => fetchNextPage()}
                onDelete={deleteComment}
                onRetry={handleRetry}
                currentUsername={user?.username ?? ''}
              />
            </div>

            <div className='bg-border h-px w-full' />

            {/* Fixed Bottom Area (Actions + Composer) */}
            <div className='flex flex-col gap-4 p-4 md:p-5'>
              <PostActions
                likesCount={post.likeCount}
                commentsCount={post.commentCount}
                sharesCount={sharesCount}
                isLiked={post.likedByMe}
                isSaved={post.saved ?? false}
                postId={post.id}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
              />

              <CommentComposer
                onSubmit={handleCreateComment}
                isPending={false}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <AuthPromptDialog
        open={authPromptState.open}
        onClose={() => setAuthPromptState({ open: false, action: null })}
        pendingAction={authPromptState.action}
      />
    </>
  );
}
