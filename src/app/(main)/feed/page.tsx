'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/hooks/useLogoutMutation';

export default function FeedPage() {
  const logout = useLogout();

  return (
    <div className='flex min-h-screen items-center justify-center bg-black text-white'>
      <div className='flex flex-col items-center gap-6 text-center'>
        <h1 className='display-md-bold'>Welcome to your Feed</h1>
        <p className='text-lg-regular text-neutral-400'>
          You are seeing this because you are logged in.
        </p>
        <Button
          variant='outline'
          onClick={logout}
          className='border-destructive/50 text-destructive hover:bg-destructive/10'
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
