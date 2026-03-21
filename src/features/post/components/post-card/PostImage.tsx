import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PostDetailLink } from './PostDetailLink';

export function PostImage({
  imageUrl,
  altText,
  className,
}: Readonly<{
  imageUrl: string;
  altText: string;
  className?: string;
}>) {
  const containerClasses = cn(
    'bg-muted relative aspect-square w-full overflow-hidden rounded-lg',
    className
  );

  return (
    <PostDetailLink
      className={containerClasses}
      fallback={
        <div className={containerClasses}>
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 361px, 600px'
          />
        </div>
      }
    >
      <Image
        src={imageUrl}
        alt={altText}
        fill
        className='object-cover'
        sizes='(max-width: 768px) 361px, 600px'
      />
    </PostDetailLink>
  );
}
