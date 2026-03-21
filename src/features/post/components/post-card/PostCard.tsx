'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export const PostCardContext = React.createContext<{
  postId: string;
} | null>(null);

export function PostCard({
  postId,
  className,
  children,
}: Readonly<{
  postId: string;
  className?: string;
  children: React.ReactNode;
}>) {
  const value = React.useMemo(() => ({ postId }), [postId]);

  return (
    <PostCardContext.Provider value={value}>
      <article
        className={cn(
          'flex w-full flex-col gap-2 md:gap-3',
          'border-border border-b pb-4',
          'w-full sm:max-w-150',
          className
        )}
      >
        {children}
      </article>
    </PostCardContext.Provider>
  );
}
