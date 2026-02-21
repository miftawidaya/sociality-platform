'use client';

import React from 'react';

type DevLayoutProps = Readonly<{
  children: React.ReactNode;
  title: string;
  description: string;
  codeSnippet?: string;
}>;

/**
 * DevLayout Component
 *
 * Shared layout for dev-only test pages to ensure consistent Header/Footer/Styling.
 */
export function DevLayout({
  children,
  title,
  description,
  codeSnippet,
}: DevLayoutProps) {
  return (
    <div className='bg-background min-h-screen'>
      {/* Hero Section */}
      <header className='relative flex min-h-[40vh] items-center overflow-hidden bg-neutral-950 py-20 dark:bg-black'>
        <div className='custom-container relative z-10'>
          <div className='mx-auto space-y-4 text-center'>
            <h1 className='display-3xl-extrabold animate-in fade-in slide-in-from-bottom-6 text-base-white duration-1000'>
              {title}
            </h1>
            <p className='text-xl-regular animate-in fade-in slide-in-from-bottom-8 text-neutral-400 delay-200 duration-1000'>
              {description}
              {codeSnippet && (
                <>
                  {' from '}
                  <code className='rounded-xs bg-white/10 px-1.5 py-0.5 backdrop-blur-sm'>
                    {codeSnippet}
                  </code>
                </>
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Shared Dev Footer */}
      <footer className='border-border mt-20 border-t py-12'>
        <div className='custom-container text-center'>
          <p className='text-text-sm-regular text-muted-foreground'>
            Sociality Design System — Developer Test Environment
          </p>
        </div>
      </footer>
    </div>
  );
}
