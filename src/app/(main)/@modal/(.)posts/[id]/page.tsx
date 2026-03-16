'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PostDetailContent, PostCommentSheet } from '@/features/post/components/post-detail';
import { cn } from '@/lib/utils';

type ModalPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default function PostModalPage({ params }: ModalPageProps) {
  const router = useRouter();
  const [isDismissing, setIsDismissing] = useState(false);
  const { id } = use(params);
  const postId = Number(id);

  const handleDismiss = useCallback(() => {
    setIsDismissing(true);
    setTimeout(() => {
      router.back();
    }, 200); // matching animation durations
  }, [router]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleDismiss]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (Number.isNaN(postId) || postId <= 0) {
    handleDismiss();
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {!isDismissing && (
        <div className="fixed inset-0 z-50">
          {/* Desktop Modal View */}
          <dialog
            open
            className='fixed inset-0 z-50 hidden m-0 h-full max-h-none w-full max-w-none bg-transparent md:flex md:items-center md:justify-center md:p-4'
            aria-label='Post detail'
          >
            {/* Backdrop - Only visible on desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 bg-black/60 backdrop-blur-sm'
              onClick={handleDismiss}
              aria-hidden='true'
            />

            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'relative flex h-full w-full flex-col md:gap-3 md:h-auto md:w-fit'
              )}
            >
              {/* Close button */}
              <div className='flex items-center justify-end'>
                <button
                  type='button'
                  onClick={handleDismiss}
                  aria-label='Close'
                  className='text-white z-10 cursor-pointer flex items-center gap-2'
                >
                  <X className='size-6' strokeWidth={2} />
                  <span className='sr-only'>Close post detail</span>
                </button>
              </div>

              <div className='bg-card flex min-h-0 w-full shrink-0 overflow-hidden rounded-lg md:w-fit'>
                <PostDetailContent postId={postId} variant='modal' />
              </div>
            </motion.div>
          </dialog>

          {/* Mobile Sheet View */}
          <PostCommentSheet 
            postId={postId} 
            onClose={handleDismiss} 
            className="md:hidden" 
          />
        </div>
      )}
    </AnimatePresence>
  );
}
