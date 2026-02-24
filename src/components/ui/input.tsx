import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        // Colors & Backgrounds
        'bg-background text-foreground placeholder:text-muted-foreground file:text-foreground',
        'selection:bg-primary selection:text-primary-foreground',
        // Borders & Radius
        'border-input rounded-xl border',
        // Sizing & Spacing
        'h-12 w-full min-w-0 px-4 py-2',
        // Typography
        'text-md-semibold placeholder:text-md-regular',
        // States & Transitions
        'shadow-xs transition-[color,box-shadow] outline-none',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
