import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function PostImage({
  imageUrl,
  altText,
  className,
}: Readonly<{
  imageUrl: string;
  altText: string;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        'bg-muted relative aspect-square w-full overflow-hidden rounded-lg',
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={altText}
        fill
        className='object-cover'
        sizes='(max-width: 768px) 361px, 600px'
      />
    </div>
  );
}
