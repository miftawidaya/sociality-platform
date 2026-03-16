'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ExpandableTextProps = Readonly<{
  text: string;
  maxLines?: number;
  className?: string;
  buttonClassName?: string;
}>;

/**
 * A reusable component that truncates text and provides a Show More/Less toggle.
 * Useful for long post captions or comments.
 */
export function ExpandableText({
  text,
  maxLines = 2,
  className,
  buttonClassName,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isTruncated, setIsTruncated] = React.useState(false);
  const textRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element && !isExpanded) {
        // Measure if the actual scroll height is greater than visible height
        // This works because we use line-clamp-2 when not expanded
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    // Small timeout to ensure DOM is ready and styles applied
    const timeoutId = setTimeout(checkTruncation, 10);
    window.addEventListener('resize', checkTruncation);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [text, isExpanded]);

  return (
    <div className='flex flex-col items-start'>
      <p
        ref={textRef}
        className={cn(
          'text-foreground transition-all duration-200',
          !isExpanded && 'line-clamp-2',
          className
        )}
        style={{
          WebkitLineClamp: isExpanded ? 'unset' : maxLines,
        }}
      >
        {text}
      </p>

      {isTruncated && (
        <button
          type='button'
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            'text-xs-bold md:text-sm-regular text-primary! mt-1 cursor-pointer hover:underline',
            buttonClassName
          )}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
}
