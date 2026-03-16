import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type PostHeaderProps = Readonly<{
  username: string;
  timestamp: string;
  avatarUrl?: string;
  className?: string;
}>;

export function PostHeader({
  username,
  timestamp,
  avatarUrl,
  className,
}: PostHeaderProps) {
  return (
    <header
      className={cn(
        'flex w-full flex-row items-center gap-2 md:gap-3',
        className
      )}
    >
      <Link href={`/users/${username}`} className='shrink-0'>
        <Avatar className='h-11 w-11 md:h-16 md:w-16'>
          {avatarUrl && (
            <AvatarImage
              src={avatarUrl}
              alt={`${username} avatar`}
              className='object-cover'
            />
          )}
          <AvatarFallback className='text-sm-bold md:text-md-bold uppercase'>
            {username.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className='flex grow flex-col'>
        <Link
          href={`/users/${username}`}
          className='text-foreground hover:underline'
        >
          <span className='text-sm-bold tracking-[-0.01em] md:text-md-bold md:tracking-[-0.02em]'>
            {username}
          </span>
        </Link>
        <time suppressHydrationWarning className='text-muted-foreground text-xs-regular md:text-sm-regular md:tracking-[-0.02em]'>
          {timestamp}
        </time>
      </div>
    </header>
  );
}
