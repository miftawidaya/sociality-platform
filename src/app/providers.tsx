'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '@/store';
import { queryClient } from '@/lib/query/client';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Global Application Providers
 * Orchestrates global state and context providers for the application tree.
 */
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position='top-right' closeButton />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
