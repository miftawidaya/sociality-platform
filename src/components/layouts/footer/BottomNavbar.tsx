'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home2, Profile } from 'iconsax-react';
import { Plus } from '@untitledui/icons';

import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';
import { memo } from 'react';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

/**
 * Bottom Navigation Bar for both mobile and desktop.
 */
function BottomNavbarComponent() {
  const pathname = usePathname();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return pathname === path || pathname === ROUTES.FEED;
    }
    return pathname?.startsWith(path);
  };

  const isPostDetailPage = pathname?.startsWith('/posts/');

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-40 w-full max-w-94 -translate-x-1/2 px-4 transition-opacity md:max-w-98',
        isPostDetailPage ? 'md:hidden' : 'flex'
      )}
    >
      <nav
        className={cn(
          'bg-card/80 border-border flex items-center justify-between gap-4 rounded-full border px-3 backdrop-blur-3xl',
          'h-16 w-full',
          'md:h-20'
        )}
      >
        <Link
          href={ROUTES.HOME}
          className='group flex w-23.5 cursor-pointer flex-col items-center justify-center gap-0.5 md:gap-1'
          aria-current={isActive(ROUTES.HOME) ? 'page' : undefined}
          aria-label='Home'
        >
          <Home2
            variant={isActive(ROUTES.HOME) ? 'Bold' : 'Linear'}
            color='currentColor'
            className={cn(
              'size-5 transition-colors md:size-6',
              isActive(ROUTES.HOME)
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-foreground'
            )}
          />
          <span
            className={cn(
              'font-sans text-xs tracking-[-0.02em] transition-colors',
              'leading-6 md:text-base md:leading-snug',
              isActive(ROUTES.HOME)
                ? 'text-primary font-bold'
                : 'text-muted-foreground group-hover:text-foreground font-normal'
            )}
          >
            Home
          </span>
        </Link>

        {/* Add Post Button Placeholder */}
        <button
          type='button'
          className={cn(
            'bg-primary hover:bg-primary/90 flex cursor-pointer items-center justify-center rounded-full transition-colors',
            'h-11 w-11',
            'md:h-12 md:w-12 md:p-2'
          )}
          aria-label='Create post'
        >
          <Plus
            className='text-primary-foreground size-5.5 md:size-6'
            strokeWidth={2.5}
          />
        </button>

        <Link
          href={ROUTES.PROFILE}
          className='group flex w-23.5 cursor-pointer flex-col items-center justify-center gap-0.5 md:gap-1'
          aria-current={isActive(ROUTES.PROFILE) ? 'page' : undefined}
          aria-label='Profile'
        >
          <Profile
            variant={isActive(ROUTES.PROFILE) ? 'Bold' : 'Linear'}
            color='currentColor'
            className={cn(
              'size-5 transition-colors md:size-6',
              isActive(ROUTES.PROFILE)
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-foreground'
            )}
          />
          <span
            className={cn(
              'font-sans text-xs tracking-[-0.02em] transition-colors',
              'leading-4 md:text-base md:leading-snug',
              isActive(ROUTES.PROFILE)
                ? 'text-primary font-bold'
                : 'text-muted-foreground group-hover:text-foreground font-normal'
            )}
          >
            Profile
          </span>
        </Link>
      </nav>
    </div>
  );
}

export const BottomNavbar = memo(BottomNavbarComponent);
