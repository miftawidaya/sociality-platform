'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useFollowers, useFollowing } from '../../queries/profile.queries';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

type FollowListModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
  username: string;
  type: 'followers' | 'following';
}>;

export function FollowListModal({
  open,
  onClose,
  username,
  type,
}: FollowListModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [isDismissing, setIsDismissing] = React.useState(false);
  const { ref, inView } = useInView();

  const followersQuery = useFollowers(username, open && type === 'followers');
  const followingQuery = useFollowing(username, open && type === 'following');

  const query = type === 'followers' ? followersQuery : followingQuery;
  const users = React.useMemo(() => {
    return (
      query.data?.pages
        .flatMap((page: any) => {
          // Robust check for different potential response structures
          const list = page?.items ?? page?.users ?? page?.followers ?? page?.following ?? page?.data?.items ?? [];
          return Array.isArray(list) ? list : [];
        })
        .filter(Boolean) || []
    );
  }, [query.data, type]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (open && !dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      } else if (!open && dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  React.useEffect(() => {
    if (inView && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [inView, query]);

  const handleClose = React.useCallback(() => {
    setIsDismissing(true);
    setTimeout(() => {
      onClose();
      setIsDismissing(false);
    }, 200);
  }, [onClose]);

  let content;
  if (query.isLoading) {
    content = (
      <div className='flex justify-center p-8'>
        <div className='border-primary size-6 animate-spin rounded-full border-2 border-t-transparent' />
      </div>
    );
  } else if (users.length === 0) {
    content = (
      <div className='text-muted-foreground flex flex-col items-center justify-center p-12 text-center'>
        <p className='text-md-regular'>No {type} found.</p>
      </div>
    );
  } else {
    content = (
      <div className='flex flex-col gap-4'>
        {users.map((user: any) => (
          <div
            key={user.id}
            className='flex flex-row items-center justify-between'
          >
            <Link
              href={`/users/${user?.username}`}
              onClick={handleClose}
              className='flex flex-row items-center gap-3'
            >
              <Avatar className='border-border size-10 border'>
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='text-sm-bold text-foreground'>
                  {user?.name}
                </span>
                <span className='text-xs-regular text-muted-foreground'>
                  @{user?.username}
                </span>
              </div>
            </Link>
          </div>
        ))}
        <div ref={ref} className='h-4' />
        {query.isFetchingNextPage && (
          <div className='flex justify-center p-4'>
            <div className='border-primary size-5 animate-spin rounded-full border-2 border-t-transparent' />
          </div>
        )}
      </div>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'backdrop:bg-background/80 backdrop:backdrop-blur-sm',
        isDismissing
          ? 'backdrop:animate-overlay-out'
          : 'backdrop:animate-overlay-in',
        'bg-card text-card-foreground m-auto flex-col shadow-lg open:flex',
        'h-[80vh] max-h-150 w-[calc(100%-2rem)] max-w-100 rounded-xl p-0',
        'border-border border',
        isDismissing ? 'animate-modal-out' : 'open:animate-modal-in',
        'ease-smooth-out transition-all duration-300'
      )}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleClose();
        }
      }}
    >
      <div className='border-border flex shrink-0 items-center justify-between border-b p-4'>
        <h2 className='text-md-bold text-foreground capitalize'>{type}</h2>
        <button
          type='button'
          onClick={handleClose}
          className='text-muted-foreground hover:text-foreground cursor-pointer transition-colors'
        >
          <X className='size-6' />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>{content}</div>
    </dialog>
  );
}
