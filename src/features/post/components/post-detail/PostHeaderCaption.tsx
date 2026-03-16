import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';

type PostHeaderCaptionProps = Readonly<{
  post: {
    author: { username: string; avatarUrl: string | null };
    caption: string;
  };
  timestamp: string;
}>;

export function PostHeaderCaption({
  post,
  timestamp,
}: PostHeaderCaptionProps) {
  return (
    <div className='flex flex-col gap-2'>
      {/* Header */}
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-3'>
          <Link href={`/users/${post.author.username}`}>
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
          </Link>

          <div className='flex flex-col'>
            <Link
              href={`/users/${post.author.username}`}
              className='text-foreground hover:underline'
            >
              <span className='text-sm-bold tracking-[-0.01em]'>
                {post.author.username}
              </span>
            </Link>
            <time suppressHydrationWarning className='text-muted-foreground text-xs-regular'>
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

      {/* Caption - no truncation in detail view */}
      <p className='text-foreground text-sm-regular leading-7 tracking-[-0.02em]'>
        {post.caption}
      </p>
    </div>
  );
}
