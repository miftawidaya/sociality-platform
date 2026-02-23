'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';
import api from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const TEST_API_ENDPOINT = '/api/posts?limit=1';
const INVALID_TRIGGER_ENDPOINT = '/api/me';

/**
 * ApiFoundationTest Component
 *
 * Specifically designed to benchmark and verify the stability of:
 * 1. Axios Interceptors (Auth & Error Handling)
 * 2. Redux Global State Integration
 * 3. TanStack Query Server State Integration
 * 4. Environment Variable Configuration
 */
export function ApiFoundationTest({
  showLayout = false,
}: {
  showLayout?: boolean;
}) {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [cookieValue, setCookieValue] = useState('None');

  React.useEffect(() => {
    setCookieValue(Cookies.get('token') || 'None');
  }, []);

  // Input-like style for read-only displays
  const displayStyle =
    'h-12 w-full min-w-0 px-4 py-2 border rounded-xl bg-background text-md-semibold flex items-center shadow-xs overflow-hidden';

  // 1. TanStack Query Fetching Test
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['posts-test'],
    queryFn: async () => {
      const response = await api.get(TEST_API_ENDPOINT);
      return response.data;
    },
    enabled: false,
  });

  // 2. Cookie Management
  const handleSetCookie = () => {
    Cookies.set('token', 'test-bearer-token-val');
    setCookieValue(Cookies.get('token') || 'None');
  };

  const handleClearCookie = () => {
    Cookies.remove('token');
    setCookieValue('None');
  };

  // 3. Redux Management
  const handleSetRedux = () => {
    dispatch(
      setCredentials({
        id: 999,
        username: 'tester',
        name: 'Foundation Tester',
        email: 'test@sociality.com',
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      })
    );
  };

  // 4. Trigger 401 Error
  const trigger401 = async () => {
    try {
      await api.get(INVALID_TRIGGER_ENDPOINT);
    } catch (error: any) {
      console.log('Error caught in test component:', error.response?.status);
      setCookieValue(Cookies.get('token') || 'None');
    }
  };

  const content = (
    <section
      className={cn(
        'custom-container space-y-6xl',
        showLayout && 'py-10 md:py-20'
      )}
      aria-labelledby='foundation-heading'
    >
      <h2 id='foundation-heading' className='display-sm-bold text-foreground'>
        Foundation Benchmark
      </h2>

      <div className='card space-y-8xl'>
        <div className='gap-8xl grid grid-cols-1 lg:grid-cols-2'>
          {/* Environment & Cookies Layer */}
          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              1. Network & Cookie Layer
            </h3>

            <div className='space-y-4xl'>
              <div className='space-y-2'>
                <p className='text-text-sm-medium text-foreground/70'>
                  API URL (ENV)
                </p>
                <div
                  className={cn(
                    displayStyle,
                    'border-input text-muted-foreground font-mono text-xs'
                  )}
                >
                  <span className='truncate'>
                    {process.env.NEXT_PUBLIC_API_URL || 'UNDEFINED'}
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <p className='text-text-sm-medium text-foreground/70'>
                  Auth Token (Cookie)
                </p>
                <div
                  className={cn(
                    displayStyle,
                    'truncate font-mono text-xs',
                    cookieValue === 'None'
                      ? 'border-destructive text-destructive bg-destructive/5'
                      : 'border-accent-green/50 text-accent-green bg-accent-green/5'
                  )}
                >
                  {cookieValue}
                </div>
              </div>

              <div className='flex flex-wrap gap-4'>
                <Button size='sm' onClick={handleSetCookie}>
                  Set Test Cookie
                </Button>
                <Button size='sm' variant='outline' onClick={handleClearCookie}>
                  Clear Cookie
                </Button>
              </div>
            </div>
          </div>

          {/* Redux State Layer */}
          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              2. Global State (Redux)
            </h3>

            <div className='space-y-4xl'>
              <div className='space-y-2'>
                <p className='text-text-sm-medium text-foreground/70'>
                  Auth Status
                </p>
                <div
                  className={cn(
                    displayStyle,
                    auth.isAuthenticated
                      ? 'border-primary/50 text-primary bg-primary/5'
                      : 'border-destructive text-destructive bg-destructive/5'
                  )}
                >
                  {auth.isAuthenticated ? 'AUTHENTICATED' : 'GUEST'}
                </div>
              </div>

              {auth.user && (
                <div className='bg-muted/30 border-border/10 p-md flex items-center gap-4 rounded-xl border shadow-sm transition-all'>
                  <img
                    src={auth.user.avatarUrl || ''}
                    className='border-border/40 size-10 rounded-full border object-cover'
                    alt=''
                  />
                  <div>
                    <p className='text-text-sm-bold text-foreground leading-tight'>
                      {auth.user.name}
                    </p>
                    <p className='text-text-xs-medium text-muted-foreground'>
                      @{auth.user.username}
                    </p>
                  </div>
                </div>
              )}

              <div className='flex flex-wrap gap-4'>
                <Button size='sm' variant='secondary' onClick={handleSetRedux}>
                  Dispatch User
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => dispatch(clearCredentials())}
                >
                  Reset State
                </Button>
              </div>
            </div>
          </div>

          {/* TanStack Query Layer */}
          <div className='space-y-6xl flex flex-col'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              3. Server State (Query)
            </h3>

            <div className='space-y-4xl flex flex-1 flex-col'>
              <div className='flex items-center justify-between px-1'>
                <span className='text-text-sm-medium text-muted-foreground'>
                  Status:{' '}
                  <span className='text-foreground'>
                    {isLoading
                      ? 'Loading...'
                      : isError
                        ? 'Error'
                        : data
                          ? 'Success'
                          : 'Ready'}
                  </span>
                </span>
                {isFetching && (
                  <div className='bg-primary size-2 animate-pulse rounded-full' />
                )}
              </div>

              <div className='bg-muted/30 border-input p-md max-h-40 min-h-40 flex-1 overflow-auto rounded-xl border font-mono text-[10px] shadow-inner'>
                {data
                  ? JSON.stringify(data, null, 2)
                  : '// data will appear here...'}
              </div>

              <div className='flex flex-wrap gap-4 pt-2'>
                <Button
                  size='sm'
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  Fetch via Axios + Query
                </Button>
              </div>
            </div>
          </div>

          {/* Interceptor Error Test */}
          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              4. Resilience (Interceptor)
            </h3>

            <div className='space-y-4xl'>
              <p className='text-text-sm-regular text-muted-foreground'>
                Verify automatic session cleanup and pro-active error handling.
              </p>

              <div className='bg-background border-input text-muted-foreground flex h-12 w-full items-center rounded-xl border px-4 text-xs italic shadow-xs'>
                Expect: 401 response triggers redirect...
              </div>

              <div className='flex flex-wrap gap-4 pt-2'>
                <Button
                  variant='outline'
                  className='border-destructive/50 text-destructive hover:bg-destructive/10'
                  onClick={trigger401}
                >
                  Trigger 401 & Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return content;
}
