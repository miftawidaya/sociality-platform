'use client';

import { useState } from 'react';
import Link from 'next/link';
import { XClose, Menu01, SearchLg, SearchMd } from '@untitledui/icons';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useSessionRehydration } from '@/features/auth/hooks/useSessionRehydration';
import { ProfileMenu } from '@/components/layout/ProfileMenu';
import type { RootState } from '@/store';

function NavbarSearch() {
  return (
    <div className='hidden w-full max-w-123 md:flex'>
      <div className='border-input bg-card flex h-12 w-full items-center gap-2 rounded-full border ps-4 pe-4'>
        <SearchLg size={15} className='shrink-0 text-neutral-500' />
        <input
          type='text'
          placeholder='Search'
          className='text-sm-bold placeholder:text-sm-regular text-foreground w-full bg-transparent outline-none placeholder:text-neutral-600'
        />
      </div>
    </div>
  );
}

function NavbarAuthActions() {
  return (
    <div className='hidden items-center gap-3 md:flex'>
      <Button variant='outline' size='lg' className='min-w-32.5' asChild>
        <Link href={ROUTES.LOGIN}>Login</Link>
      </Button>
      <Button size='lg' className='min-w-32.5' asChild>
        <Link href={ROUTES.REGISTER}>Register</Link>
      </Button>
    </div>
  );
}

type UserProfile = Readonly<{
  name: string;
  avatarUrl: string | null;
}>;

function MobileActions({
  isAuthenticated,
  onOpenSearch,
  isSearchOpen,
}: Readonly<{
  isAuthenticated: boolean;
  onOpenSearch: () => void;
  isSearchOpen: boolean;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex items-center gap-4 md:hidden'>
      {!isSearchOpen && (
        <button
          type='button'
          onClick={onOpenSearch}
          aria-label='Open search'
          className='cursor-pointer'
        >
          <SearchLg className='text-foreground size-5 shrink-0' />
        </button>
      )}

      {isAuthenticated === false && (
        <button
          type='button'
          className='cursor-pointer'
          onClick={() => setIsOpen(!isOpen)}
          aria-label='Toggle menu'
        >
          {isOpen ? (
            <XClose className='text-foreground size-6' />
          ) : (
            <Menu01 className='text-foreground size-6' />
          )}
        </button>
      )}

      {isOpen && isAuthenticated === false && (
        <div className='border-border bg-background absolute inset-s-0 inset-e-0 top-16 -mt-px flex items-center gap-2 border-b px-4 pb-3 shadow-sm'>
          <Button variant='outline' size='lg' className='grow' asChild>
            <Link href={ROUTES.LOGIN}>Login</Link>
          </Button>
          <Button size='lg' className='grow' asChild>
            <Link href={ROUTES.REGISTER}>Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function MobileSearchInput({ onClose }: Readonly<{ onClose: () => void }>) {
  const [query, setQuery] = useState('');

  return (
    <div className='flex grow items-center gap-3 md:hidden'>
      <div className='border-input bg-card flex h-10 grow items-center gap-2 rounded-full border px-3'>
        <SearchMd size={16} className='shrink-0 text-neutral-500' />
        <input
          type='text'
          placeholder='Search'
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='text-sm-bold placeholder:text-sm-regular text-foreground w-full bg-transparent outline-none placeholder:text-neutral-500'
        />
        {query.length > 0 && (
          <button
            type='button'
            onClick={() => setQuery('')}
            className='hover:text-foreground shrink-0 cursor-pointer text-neutral-400'
            aria-label='Clear search'
          >
            <Icon icon='icon-park-solid:close-one' fontSize={16} />
          </button>
        )}
      </div>
      <button
        type='button'
        onClick={onClose}
        className='text-foreground shrink-0 cursor-pointer'
        aria-label='Close search'
      >
        <XClose size={24} />
      </button>
    </div>
  );
}

export function Navbar({ className }: Readonly<{ className?: string }>) {
  useSessionRehydration();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <nav
      className={cn(
        'bg-background border-border sticky top-0 z-30 w-full border-b',
        'h-16 md:h-20',
        className
      )}
    >
      <div className='custom-container relative flex h-full items-center justify-between gap-6'>
        {isMobileSearchOpen && (
          <MobileSearchInput onClose={() => setIsMobileSearchOpen(false)} />
        )}

        <div
          className={cn(
            'flex shrink-0 items-center',
            isMobileSearchOpen && 'max-md:hidden'
          )}
        >
          <Link href={ROUTES.HOME}>
            <Logo />
          </Link>
        </div>

        <NavbarSearch />

        <div
          className={cn(
            'flex items-center gap-4',
            isMobileSearchOpen && 'max-md:hidden'
          )}
        >
          {/* Mobile search icon + menu, desktop search is central */}
          <MobileActions
            isAuthenticated={isAuthenticated}
            onOpenSearch={() => setIsMobileSearchOpen(true)}
            isSearchOpen={isMobileSearchOpen}
          />

          {isAuthenticated && user ? (
            <ProfileMenu
              name={user.name}
              avatarUrl={user.avatarUrl ?? undefined}
            />
          ) : (
            <NavbarAuthActions />
          )}
        </div>
      </div>
    </nav>
  );
}
