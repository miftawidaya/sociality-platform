'use client';

import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  usePostDetailQuery,
  useCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '../../hooks/usePostDetailQuery';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CommentsList } from './CommentsList';
import { CommentComposer } from './CommentComposer';
import type { Comment } from '../../types';
import React from 'react';

type PostCommentSheetProps = Readonly<{
  postId: number;
  onClose: () => void;
  className?: string;
}>;

/**
 * Bottom sheet for comments on mobile devices.
 */
export function PostCommentSheet({
  postId,
  onClose,
  className,
}: PostCommentSheetProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { isLoading: isPostLoading } = usePostDetailQuery(postId);
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
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

  const isLoading = isPostLoading || isCommentsLoading;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col justify-end md:hidden',
        className
      )}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className='absolute inset-0 bg-black/60 shadow-lg backdrop-blur-sm'
      />

      {/* Sheet Animated Container */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className='relative flex h-142.5 w-full flex-col items-end gap-2'
      >
        {/* Close Button wrapper - Outside of the sheet body */}
        <div className='flex h-6 w-14 items-center justify-center px-4'>
          <button
            onClick={onClose}
            className='flex size-6 cursor-pointer items-center justify-center transition-colors active:opacity-70'
          >
            <X className='text-foreground size-6' strokeWidth={2.5} />
            <span className='sr-only'>Close comments</span>
          </button>
        </div>

        {/* Sheet Body Container */}
        <div className='border-border bg-card flex w-full grow flex-col overflow-hidden rounded-t-2xl border-t shadow-xl'>
          <div className='flex min-h-0 grow flex-col px-4 pt-4 pb-4'>
            {/* Header */}
            <h2 className='text-foreground text-md-bold mb-4 leading-7.5 tracking-[-0.02em]'>
              Comments
            </h2>

            {/* List Area */}
            <div ref={scrollRef} className='min-h-0 flex-1 overflow-y-auto'>
              {isLoading && allComments.length === 0 ? (
                <div className='flex h-full items-center justify-center py-10'>
                  <div className='border-primary h-8 w-8 animate-spin rounded-full border-t-2 border-r-2' />
                </div>
              ) : (
                <CommentsList
                  comments={allComments}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={() => fetchNextPage()}
                  onDelete={deleteComment}
                  onRetry={handleRetry}
                  currentUsername={user?.username ?? ''}
                />
              )}
            </div>

            {/* Line Separator */}
            <div className='border-border my-2 border-t' />

            {/* Composer */}
            <div className='bg-card shrink-0 pt-2'>
              <CommentComposer
                onSubmit={handleCreateComment}
                isPending={false}
                className='w-full'
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
