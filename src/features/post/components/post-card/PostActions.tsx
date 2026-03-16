import * as React from 'react';
import Link from 'next/link';
import { Heart, Message, Send2, Archive } from 'iconsax-react';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { useSavedPostsIdsQuery } from '@/features/post/hooks/useFeedQuery';
import { PostCardContext } from './PostCard';

type PostActionsProps = Readonly<{
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  postId?: number;
  onLike?: () => void;
  onCommentClick?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  className?: string;
}>;

export function PostActions({
  likesCount,
  commentsCount,
  sharesCount,
  isLiked = false,
  isSaved = false,
  postId,
  onLike,
  onCommentClick,
  onShare,
  onSave,
  className,
}: PostActionsProps) {
  const context = React.useContext(PostCardContext);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Hook into the reactive saved-ids cache
  const { data: savedIds } = useSavedPostsIdsQuery(isAuthenticated);

  // Determine the effective saved status:
  // Prefer the reactive cache if available, fallback to the prop
  const numericPostId =
    postId ?? (context ? Number(context.postId) : undefined);
  const isSavedEffective =
    (numericPostId && savedIds?.has(numericPostId)) || isSaved;

  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-between',
        'h-7 md:h-7.5',
        className
      )}
    >
      <div className='flex flex-row items-center gap-3 md:gap-4'>
        {/* Like Button */}
        <button
          type='button'
          onClick={onLike}
          suppressHydrationWarning
          aria-label={isLiked ? 'Unlike' : 'Like'}
          className='group flex cursor-pointer items-center gap-1.5'
        >
          <Heart
            variant={isLiked ? 'Bold' : 'Linear'}
            color='currentColor'
            className={cn(
              'size-6 transition-colors',
              isLiked
                ? 'text-social-like'
                : 'text-foreground group-hover:text-muted-foreground'
            )}
          />
          <span
            suppressHydrationWarning
            className='text-foreground text-sm-semibold md:text-md-semibold tracking-[-0.02em]'
          >
            {likesCount}
          </span>
        </button>

        {/* Comment Button - Link to post detail when in PostCard context */}
        {context ? (
          <Link
            href={`/posts/${context.postId}`}
            scroll={false}
            aria-label='View comments'
            className='text-foreground hover:text-muted-foreground group flex items-center gap-1.5 transition-colors'
          >
            <Message variant='Linear' color='currentColor' className='size-6' />
            <span className='text-sm-semibold md:text-md-semibold tracking-[-0.02em]'>
              {commentsCount}
            </span>
          </Link>
        ) : (
          <button
            type='button'
            onClick={onCommentClick}
            aria-label='Comment'
            className='text-foreground hover:text-muted-foreground group flex cursor-pointer items-center gap-1.5 transition-colors'
          >
            <Message variant='Linear' color='currentColor' className='size-6' />
            <span className='text-sm-semibold md:text-md-semibold tracking-[-0.02em]'>
              {commentsCount}
            </span>
          </button>
        )}

        {/* Share Button */}
        <button
          type='button'
          onClick={onShare}
          aria-label='Share'
          className='text-foreground hover:text-muted-foreground group flex cursor-pointer items-center gap-1.5 transition-colors'
        >
          <Send2 variant='Linear' color='currentColor' className='size-6' />
          <span className='text-sm-semibold md:text-md-semibold tracking-[-0.02em]'>
            {sharesCount}
          </span>
        </button>
      </div>

      {/* Save Button */}
      <button
        type='button'
        onClick={onSave}
        aria-label={isSavedEffective ? 'Unsave' : 'Save'}
        className={cn(
          'text-foreground hover:text-muted-foreground cursor-pointer transition-colors',
          isSavedEffective && 'text-foreground'
        )}
      >
        <Archive
          variant={isSavedEffective ? 'Bold' : 'Linear'}
          color='currentColor'
          className='size-6'
        />
      </button>
    </div>
  );
}
