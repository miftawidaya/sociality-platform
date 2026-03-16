import type { UserStats } from '../types/profile.types';

type ProfileStatsProps = Readonly<{
  stats: UserStats;
}>;

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    { label: 'Post', value: stats.posts },
    { label: 'Followers', value: stats.followers },
    { label: 'Following', value: stats.following },
    { label: 'Likes', value: stats.likes },
  ];

  return (
    <div className='flex w-full flex-row items-center justify-between md:justify-start md:gap-6'>
      {statItems.map((item, index) => (
        <div key={item.label} className='flex flex-row items-center'>
          <div className='flex min-w-13.5 flex-col items-center justify-center md:min-w-41.75'>
            <span className='text-foreground text-lg-bold md:text-xl-bold tracking-[-0.03em] md:tracking-[-0.02em]'>
              {item.value || 0}
            </span>
            <span className='text-muted-foreground text-xs-regular md:text-md-regular'>
              {item.label}
            </span>
          </div>
          {index < statItems.length - 1 && (
            <div className='bg-border mx-2 h-12.5 w-px md:h-16.5' />
          )}
        </div>
      ))}
    </div>
  );
}
