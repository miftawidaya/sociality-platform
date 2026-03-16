import * as React from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Post } from '@/features/post/types';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProfileGalleryProps = Readonly<{
  data?: {
    pages?: { posts: Post[] }[];
  };
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  emptyMessage?: string;
  isOwner: boolean;
  activeTab: string;
}>;

/**
 * Skeleton loading state for the gallery
 */
function GallerySkeleton() {
  return (
    <div className='mt-6 grid w-full grid-cols-3 gap-0.5 md:gap-1'>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className='bg-muted aspect-square animate-pulse rounded-md'
        />
      ))}
    </div>
  );
}

/**
 * Component for rendering the empty state with CTA
 */
function GalleryEmptyState({
  activeTab,
  isOwner,
  emptyMessage,
}: Readonly<{
  activeTab: string;
  isOwner: boolean;
  emptyMessage: string;
}>) {
  let title = '';
  let description = '';
  let buttonLabel = '';
  let buttonHref = '';

  if (activeTab === 'posts') {
    if (isOwner) {
      title = 'Your story starts here';
      description =
        'Share your first post and let the world see your moments, passions, and memories. Make this space truly yours.';
      buttonLabel = 'Upload My First Post';
    } else {
      title = 'No posts yet';
      description = "This user hasn't shared any posts yet.";
    }
  } else if (activeTab === 'saved') {
    title = 'Save for later';
    description =
      'Save posts you love to revisit them easily. Only you can see your saved collection.';
    buttonLabel = 'Explore Posts';
    buttonHref = '/';
  } else if (activeTab === 'likes') {
    title = 'No liked posts';
    description = isOwner
      ? "You haven't liked any posts yet. Start exploring and double-tap to like!"
      : "This user hasn't liked any posts yet.";
  }

  if (!title) {
    return (
      <div className='text-muted-foreground mt-6 flex flex-col items-center justify-center p-12 text-center'>
        <Camera className='mb-4 size-12 opacity-50' />
        <p className='text-md-regular'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center gap-6 px-4 py-20 text-center md:gap-8'>
      <div className='flex flex-col items-center gap-1'>
        <h3 className='text-foreground text-md-bold md:text-lg-bold tracking-[-0.02em] md:tracking-[-0.03em]'>
          {title}
        </h3>
        <p className='text-muted-foreground text-sm-regular md:text-md-regular max-w-90.25 leading-7 tracking-[-0.02em] md:max-w-113.25 md:leading-7.5'>
          {description}
        </p>
      </div>
      {buttonLabel && (
        <Button
          className='bg-primary text-primary-foreground text-sm-bold md:text-md-bold h-10 w-full max-w-64.75 rounded-full hover:opacity-90 md:h-12'
          asChild={!!buttonHref}
        >
          {buttonHref ? (
            <Link href={buttonHref}>{buttonLabel}</Link>
          ) : (
            buttonLabel
          )}
        </Button>
      )}
    </div>
  );
}

export function ProfileGallery({
  data,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  emptyMessage = 'No posts found.',
  isOwner,
  activeTab,
}: ProfileGalleryProps) {
  const { ref, inView } = useInView();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <GallerySkeleton />;

  if (isError) {
    return (
      <div className='text-destructive mt-6 flex items-center justify-center p-12'>
        Failed to load gallery content.
      </div>
    );
  }

  const posts = data?.pages?.flatMap((page) => page.posts) || [];

  if (posts.length === 0) {
    return (
      <GalleryEmptyState
        activeTab={activeTab}
        isOwner={isOwner}
        emptyMessage={emptyMessage}
      />
    );
  }

  return (
    <>
      <div className='mt-6 grid w-full grid-cols-3 gap-0.5 md:gap-1'>
        {posts.map((post) => {
          const href = `/posts/${post.id}`;
          const content = (
            <img
              src={post.imageUrl}
              alt={post.caption || 'Post image'}
              className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
              loading='lazy'
            />
          );

          const className =
            'bg-muted group rounded-xxs relative block aspect-square cursor-pointer overflow-hidden md:rounded-md';

          if (isMobile) {
            return (
              <a key={post.id} href={href} className={className}>
                {content}
              </a>
            );
          }

          return (
            <Link
              key={post.id}
              href={href}
              scroll={false}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </div>

      <div ref={ref} className='flex w-full justify-center py-8'>
        {isFetchingNextPage && (
          <div className='border-primary size-6 animate-spin rounded-full border-2 border-t-transparent' />
        )}
      </div>
    </>
  );
}
