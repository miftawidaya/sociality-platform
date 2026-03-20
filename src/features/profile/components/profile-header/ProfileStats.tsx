import type { UserStats } from '../../types/profile.types';
import { FollowListModal } from '../follow-list/FollowListModal';
import * as React from 'react';
import { cn } from '@/lib/utils';

type ProfileStatsProps = Readonly<{
  stats: UserStats;
  username: string;
}>;

export function ProfileStats({ stats, username }: ProfileStatsProps) {
  const [modalConfig, setModalConfig] = React.useState<{
    open: boolean;
    type: 'followers' | 'following';
  }>({ open: false, type: 'followers' });

  const statItems = [
    { label: 'Post', value: stats.posts, clickable: false },
    { label: 'Followers', value: stats.followers, clickable: true, type: 'followers' as const },
    { label: 'Following', value: stats.following, clickable: true, type: 'following' as const },
    { label: 'Likes', value: stats.likes, clickable: false },
  ];

  const handleStatClick = (type?: 'followers' | 'following') => {
    if (type) {
      setModalConfig({ open: true, type });
    }
  };

  return (
    <div className='flex w-full flex-row items-center justify-between md:justify-start md:gap-6'>
      {statItems.map((item, index) => (
        <div key={item.label} className='flex flex-row items-center'>
          <button
            type='button'
            disabled={!item.clickable}
            onClick={() => handleStatClick(item.type)}
            className={cn(
              'flex min-w-13.5 flex-col items-center justify-center md:min-w-41.75 p-1 rounded-lg transition-colors',
              item.clickable && 'hover:bg-accent cursor-pointer'
            )}
          >
            <span className='text-foreground text-lg-bold md:text-xl-bold tracking-[-0.03em] md:tracking-[-0.02em]'>
              {item.value || 0}
            </span>
            <span className='text-muted-foreground text-xs-regular md:text-md-regular'>
              {item.label}
            </span>
          </button>
          {index < statItems.length - 1 && (
            <div className='bg-border mx-2 h-12.5 w-px md:h-16.5' />
          )}
        </div>
      ))}

      <FollowListModal
        open={modalConfig.open}
        onClose={() => setModalConfig({ ...modalConfig, open: false })}
        username={username}
        type={modalConfig.type}
      />
    </div>
  );
}
