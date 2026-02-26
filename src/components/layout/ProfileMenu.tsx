/**
 * ProfileMenu Component
 *
 * Dropdown menu for authenticated users with links to profile and logout.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Profile } from 'iconsax-react';
import { ArrowCircleBrokenLeft } from '@untitledui/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useLogout } from '@/features/auth/hooks/useLogoutMutation';
import { ROUTES } from '@/config/routes';

type ProfileMenuProps = Readonly<{
  name: string;
  avatarUrl?: string;
}>;

export function ProfileMenu({ name, avatarUrl }: ProfileMenuProps) {
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='group flex cursor-pointer items-center gap-3 outline-hidden'>
          <Avatar className='group-hover:ring-primary size-10 transition-all group-hover:ring-2 md:size-12'>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className='bg-primary/20 text-primary'>
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='hover:text-primary text-md-bold text-foreground hidden md:block'>
            {name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='flex w-56 flex-col gap-3 rounded-2xl p-4'
        align='end'
        sideOffset={12}
      >
        <DropdownMenuLabel className='p-0'>
          <Link
            href={ROUTES.PROFILE}
            className='hover:text-primary group flex items-center gap-2 p-0 outline-hidden transition-colors'
          >
            <Avatar className='group-hover:ring-primary size-9 transition-all group-hover:ring-2'>
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className='bg-primary/20 text-primary text-xs'>
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className='text-md-bold'>{name}</span>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='bg-border mx-0 my-0 h-px' />
        <div className='flex flex-col gap-1'>
          <DropdownMenuItem asChild className='cursor-pointer gap-2 rounded-xl'>
            <Link href={ROUTES.PROFILE}>
              <Profile
                variant='Linear'
                color='currentColor'
                className='size-5.5 shrink-0'
              />
              <span className='text-sm-medium'>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer gap-2 rounded-xl'
            onSelect={logout}
          >
            <ArrowCircleBrokenLeft
              className='size-5 shrink-0'
              strokeWidth={2}
            />
            <span className='text-sm-medium'>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
