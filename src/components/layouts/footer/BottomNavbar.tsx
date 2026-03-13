'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home2, Profile } from 'iconsax-react';
import { Plus } from '@untitledui/icons';

import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';
import { memo } from 'react';

/**
 * Bottom Navigation Bar for both mobile and desktop.
 */
function BottomNavbarComponent() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return pathname === path || pathname === ROUTES.FEED;
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className='fixed bottom-8 left-1/2 z-50 -translate-x-1/2'>
      <nav
        className={cn(
          'bg-card/80 border-border gap-bottom-nav-gap flex items-center justify-center rounded-full border backdrop-blur-3xl',
          'h-16 w-bottom-nav-mobile',
          'md:h-20 md:w-bottom-nav-desktop'
        )}
      >
        <Link
          href={ROUTES.HOME}
          className='w-bottom-nav-item group flex cursor-pointer flex-col items-center justify-center gap-0.5 md:gap-1'
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
                ? 'font-bold text-primary'
                : 'font-normal text-muted-foreground group-hover:text-foreground'
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
          <Plus className='size-5.5 text-primary-foreground md:size-6' strokeWidth={2.5} />
        </button>

        <Link
          href={ROUTES.PROFILE}
          className='w-bottom-nav-item group flex cursor-pointer flex-col items-center justify-center gap-0.5 md:gap-1'
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
                ? 'font-bold text-primary'
                : 'font-normal text-muted-foreground group-hover:text-foreground'
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
