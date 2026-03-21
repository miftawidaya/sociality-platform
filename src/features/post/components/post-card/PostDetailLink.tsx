'use client';

import * as React from 'react';
import Link from 'next/link';
import { PostCardContext } from './PostCard';
import { useIsMobile } from '@/hooks/use-mobile';

type PostDetailLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  fallback?: React.ReactNode;
  postId?: string | number; // Optional prop to bypass context dependency
};

export function PostDetailLink({ children, fallback, postId, ...props }: PostDetailLinkProps) {
  const context = React.useContext(PostCardContext);
  const isMobile = useIsMobile();
  
  // Decide the true postId from either direct prop or context
  const finalPostId = postId || context?.postId;

  if (!finalPostId) {
    return <>{fallback || children}</>;
  }

  const href = `/posts/${finalPostId}`;

  // On Mobile, INTENT = View Full Page (Bypass Next.js modal intercept to prevent sheet rendering)
  if (isMobile) {
    // We render a standard anchor tag so standard browser routing takes over instead of Next.js soft navigation
    return (
      <a href={href} className={props.className} aria-label={props['aria-label']}>
        {children}
      </a>
    );
  }

  // On Desktop, INTENT = View Desktop Modal (Soft navigation trigger intercept route)
  return (
    <Link href={href} scroll={false} prefetch={true} {...props}>
      {children}
    </Link>
  );
}
