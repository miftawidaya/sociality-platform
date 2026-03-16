import { CommentItem } from './CommentItem';
import type { Comment } from '../../types';

type CommentsListProps = Readonly<{
  comments: Comment[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onDelete: (commentId: number) => void;
  onRetry?: (comment: Comment) => void;
  currentUsername: string;
}>;

export function CommentsList({
  comments,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onDelete,
  onRetry,
  currentUsername,
}: CommentsListProps) {
  return (
    <div className='flex flex-col gap-4'>
      {comments.length === 0 ? (
        <p className='text-muted-foreground text-sm-regular'>
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className='flex flex-col gap-4'>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwner={
                comment.author.username === currentUsername || comment.id < 0
              }
              onDelete={onDelete}
              onRetry={onRetry}
            />
          ))}

          {hasNextPage && (
            <button
              type='button'
              onClick={onLoadMore}
              disabled={isFetchingNextPage}
              className='text-primary text-sm-bold cursor-pointer hover:underline disabled:opacity-50'
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more comments'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
