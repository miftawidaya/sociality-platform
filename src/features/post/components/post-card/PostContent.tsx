import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function PostContent({
  username,
  content,
  className,
}: Readonly<{
  username: string;
  content: string;
  className?: string;
}>) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isTruncated, setIsTruncated] = React.useState(false);
  const textRef = React.useRef<HTMLParagraphElement>(null);

  /**
   * Effect to determine if the text is actually truncated (exceeds 2 lines).
   * Monitors content changes and window resizing for accurate detection.
   */
  React.useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        // Temporarily remove clamp to measure actual height if not expanded
        if (!isExpanded) {
          setIsTruncated(element.scrollHeight > element.clientHeight);
        }
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [content, isExpanded]);

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-0 md:gap-1',
        className
      )}
    >
      <Link href={`/users/${username}`} className='hover:underline'>
        <span className='text-foreground text-sm-bold tracking-[-0.01em] md:text-md-bold md:tracking-[-0.02em]'>
          {username}
        </span>
      </Link>
      
      <p
        ref={textRef}
        className={cn(
          'text-foreground text-sm-regular tracking-[-0.02em] md:text-md-regular transition-all duration-200',
          !isExpanded && 'line-clamp-2'
        )}
      >
        {content}
      </p>

      {isTruncated && (
        <button
          type='button'
          onClick={() => setIsExpanded((prev) => !prev)}
          className='text-primary mt-0.5 cursor-pointer text-sm-bold tracking-[-0.01em] hover:underline md:text-md-semibold'
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
}

