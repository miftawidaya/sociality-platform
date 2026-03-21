'use client';

import * as React from 'react';
import Link from 'next/link';
import { PostCardContext } from './PostCard';

type PostCommentLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  fallback?: React.ReactNode;
};

export function PostCommentLink({
  children,
  fallback,
  ...props
}: PostCommentLinkProps) {
  const context = React.useContext(PostCardContext);

  if (!context) {
    return <>{fallback || children}</>;
  }

  const href = `/posts/${context.postId}`;

  return (
    <Link href={href} scroll={false} prefetch={true} {...props}>
      {children}
    </Link>
  );
}
