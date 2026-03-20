import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        // Colors & Backgrounds
        'bg-background text-foreground placeholder:text-muted-foreground',
        'selection:bg-primary selection:text-primary-foreground',
        // Borders & Radius
        'border-input rounded-xl border',
        // Sizing & Spacing
        'w-full min-w-0 px-4 py-2 min-h-24',
        // Typography
        'text-md-semibold placeholder:text-md-regular',
        // States & Transitions
        'shadow-xs transition-[color,box-shadow] outline-none',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
