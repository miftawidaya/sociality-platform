'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { ArrowLeft, Menu01, XClose } from '@untitledui/icons';
import { cn } from '@/lib/utils';
import { ProfileMenu } from '@/components/layout/ProfileMenu';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import type { RootState } from '@/store';

type PageHeaderProps = Readonly<{
  title: string;
  backTo?: string;
  user?: {
    name: string;
    avatarUrl?: string;
  };
  className?: string;
}>;

export function PageHeader({
  title,
  backTo = '/',
  user: initialUser,
  className,
}: PageHeaderProps) {
  const { user: reduxUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = initialUser ?? (isAuthenticated ? reduxUser : undefined);

  return (
    <header
      className={cn(
        'bg-background border-border sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 md:h-20 md:px-6',
        className
      )}
    >
      <div className='flex items-center gap-3'>
        <Link
          href={backTo}
          className='hover:bg-muted text-foreground flex size-10 items-center justify-center rounded-full transition-colors'
          aria-label='Go back'
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className='text-md-bold text-foreground'>{title}</h1>
      </div>

      {isAuthenticated && user ? (
        <ProfileMenu name={user.name} avatarUrl={user.avatarUrl ?? undefined} />
      ) : (
        <div className='flex items-center md:hidden'>
          <button
            type='button'
            className='text-foreground cursor-pointer'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
          >
            {isMenuOpen ? <XClose size={24} /> : <Menu01 size={24} />}
          </button>

          {isMenuOpen && (
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
      )}
    </header>
  );
}
