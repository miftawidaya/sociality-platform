import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type PostDetailSkeletonProps = Readonly<{
  /** modal = rendered inside overlay; page = direct URL full page */
  variant?: 'modal' | 'page';
  className?: string;
}>;

export function PostDetailSkeleton({ variant = 'page', className }: PostDetailSkeletonProps) {
  return (
    <motion.div
      layout
      initial={false}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'bg-card flex w-full animate-pulse flex-col overflow-hidden md:flex-row md:w-fit',
        'h-full min-h-0 md:h-[calc(100vh-6rem)] md:max-h-192',
        variant === 'page' && 'md:rounded-lg md:border md:border-border',
        className
      )}
    >
      {/* Image skeleton - matching the black background look */}
      <div className={cn(
        'bg-muted w-full shrink items-center justify-center',
        // Give a fixed placeholder width to the image side in skeleton so it lays out nicely
        'h-[50vh] w-full md:h-full md:w-150',
        'md:max-w-(--post-detail-content-width) lg:max-w-fit'
      )} />

      {/* Content skeleton */}
      <div className='flex w-full shrink-0 flex-col md:w-(--post-detail-content-width)'>
        {/* 1. Header Area */}
        <div className='border-border border-b p-4 md:p-5'>
          <div className='flex items-center gap-3'>
            <div className='bg-muted size-10 rounded-full' />
            <div className='flex flex-col gap-1'>
              <div className='bg-muted h-4 w-20 rounded' />
              <div className='bg-muted h-3 w-16 rounded' />
            </div>
          </div>
        </div>

        {/* 2. Middle Area (Scrollable space) */}
        <div className='flex grow flex-col gap-6 p-4 md:p-5'>
          {/* Caption placeholder */}
          <div className='flex flex-col gap-2'>
            <div className='bg-muted h-4 w-full rounded' />
            <div className='bg-muted h-4 w-4/5 rounded' />
          </div>

          {/* Comments title */}
          <div className='bg-muted h-5 w-24 rounded uppercase opacity-50' />

          {/* Comment items */}
          <div className='flex flex-col gap-6'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='bg-muted size-10 rounded-full' />
                  <div className='flex flex-col gap-1'>
                    <div className='bg-muted h-4 w-16 rounded' />
                    <div className='bg-muted h-3 w-12 rounded' />
                  </div>
                </div>
                <div className='bg-muted h-4 w-full rounded' />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Area */}
        <div className='border-border border-t p-4 md:p-5'>
          <div className='flex flex-col gap-4'>
            <div className='flex justify-between'>
              <div className='flex gap-4'>
                <div className='bg-muted h-6 w-12 rounded' />
                <div className='bg-muted h-6 w-12 rounded' />
                <div className='bg-muted h-6 w-12 rounded' />
              </div>
              <div className='bg-muted h-6 w-8 rounded' />
            </div>
            <div className='flex gap-2'>
              <div className='bg-muted h-12 w-12 rounded-xl' />
              <div className='bg-muted h-12 grow rounded-xl' />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
