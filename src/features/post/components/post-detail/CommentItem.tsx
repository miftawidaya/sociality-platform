import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import type { Comment } from '../../types';
import { getRelativeTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import { ExpandableText } from '@/components/shared/ExpandableText';

type CommentItemProps = Readonly<{
  comment: Comment;
  isOwner: boolean;
  onDelete?: (commentId: number) => void;
  onRetry?: (comment: Comment) => void;
}>;

export function CommentItem({
  comment,
  isOwner,
  onDelete,
  onRetry,
}: CommentItemProps) {
  const timestamp = getRelativeTime(comment.createdAt);

  const isNew = comment.id < 0;

  return (
    <div
      className={cn(
        'border-border flex flex-col gap-2.5 border-b pb-2.5 transition-colors duration-700 last:border-0',
        isNew && 'bg-primary/10 -mx-3 rounded-lg p-3'
      )}
    >
      <div className='flex flex-row items-center gap-2'>
        <Avatar className='size-10 shrink-0'>
          {comment.author.avatarUrl && (
            <AvatarImage
              src={comment.author.avatarUrl}
              alt={`${comment.author.username} avatar`}
              className='object-cover'
            />
          )}
          <AvatarFallback className='text-sm-bold uppercase'>
            {comment.author.username.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className='flex grow flex-col justify-center'>
          <span className='text-foreground text-xs-semibold md:text-sm-regular leading-5 tracking-[-0.01em]'>
            {comment.author.username}
          </span>
          <div className='flex items-center gap-2'>
            <time
              suppressHydrationWarning
              className='text-xs-regular text-muted-foreground leading-4'
            >
              {timestamp}
            </time>
            {comment.status === 'sending' && (
              <span className='text-muted-foreground animate-pulse text-[10px] font-medium'>
                Sending...
              </span>
            )}
            {comment.status === 'error' && (
              <span className='text-destructive text-[10px] font-medium'>
                Failed to send
              </span>
            )}
          </div>
        </div>

        {isOwner && onDelete && (
          <button
            type='button'
            onClick={() => onDelete(comment.id)}
            aria-label='Delete comment'
            className='text-muted-foreground hover:text-destructive cursor-pointer transition-colors'
          >
            <Trash2 className='size-3.5' />
            <span className='sr-only'>Delete comment</span>
          </button>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <ExpandableText
          text={comment.text}
          className={cn(
            'text-xs-regular md:text-sm-regular leading-5 tracking-[-0.03em]',
            comment.status === 'sending' && 'opacity-50'
          )}
        />

        {comment.status === 'error' && onRetry && (
          <button
            type='button'
            onClick={() => onRetry(comment)}
            className='text-primary cursor-pointer self-start text-[10px] font-bold hover:underline'
          >
            Retry sending
          </button>
        )}
      </div>
    </div>
  );
}
