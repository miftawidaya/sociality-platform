import * as React from 'react';
import { Send2 } from 'iconsax-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { shareContent } from '@/lib/utils/share';
import type { UserProfileInfo } from '../types/profile.types';

type ProfileHeaderProps = Readonly<{
  user: UserProfileInfo;
  isOwner: boolean;
}>;

export function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  const handleShare = async () => {
    const shareData: ShareData = {
      title: `${user.name} (@${user.username})`,
      text: user.bio || `Check out ${user.name}'s profile on Sociality!`,
      url: `${globalThis.location?.origin}/profile/${user.username}`,
    };
    await shareContent(shareData);
  };

  return (
    <div className='flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0'>
      <div className='flex flex-row items-end gap-3 md:gap-5'>
        <Avatar className='border-border size-16 shrink-0 border md:size-16'>
          <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <h1 className='text-foreground text-sm-bold md:text-md-bold tracking-[-0.02em]'>
            {user.name}
          </h1>
          <p className='text-foreground text-sm-regular md:text-md-regular tracking-[-0.02em]'>
            {user.username}
          </p>
        </div>
      </div>

      <div className='mt-3 flex w-full flex-row items-center gap-3 md:mt-0 md:w-auto'>
        {isOwner ? (
          <Button
            variant='outline'
            className='border-border hover:bg-accent h-10 grow rounded-full bg-transparent md:w-32.5 md:grow-0'
          >
            <span className='text-foreground text-sm-bold md:text-md-bold tracking-[-0.02em]'>
              Edit Profile
            </span>
          </Button>
        ) : (
          <Button className='bg-primary text-primary-foreground h-10 grow rounded-full hover:opacity-90 md:w-32.5 md:grow-0'>
            <span className='text-sm-bold md:text-md-bold tracking-[-0.02em]'>
              Follow
            </span>
          </Button>
        )}
        <button
          type='button'
          onClick={handleShare}
          className='border-border hover:bg-accent flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors md:size-12'
          aria-label='Share profile'
        >
          <Send2
            className='size-5 md:size-6'
            color='currentColor'
            variant='Linear'
          />
        </button>
      </div>
    </div>
  );
}
