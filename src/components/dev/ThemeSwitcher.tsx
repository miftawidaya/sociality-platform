'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeSwitcherProps = Readonly<{
  /** Horizontal position of the floating button */
  position?: 'left' | 'center' | 'right';
}>;

/**
 * Floating Theme Switcher component for development and testing.
 * Automatically toggles the 'dark' class on the document root to sync with globals.css.
 */
export function ThemeSwitcher({ position = 'right' }: ThemeSwitcherProps) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Sync with document class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle entrance delay (optimized for developer experience)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Map position prop to Tailwind classes
  const positionClasses = {
    left: 'start-4',
    center: 'inset-x-0 mx-auto w-fit',
    right: 'end-4',
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-bottom-8 fixed bottom-4 z-100 transition-all duration-700',
        positionClasses[position]
      )}
    >
      <Button
        variant='outline'
        size='icon'
        onClick={() => setIsDark(!isDark)}
        className='border-border bg-background/80 hover:bg-accent hover:text-accent-foreground size-9 rounded-full border shadow-lg backdrop-blur-md'
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? <Sun className='size-4' /> : <Moon className='size-4' />}
      </Button>
    </div>
  );
}
