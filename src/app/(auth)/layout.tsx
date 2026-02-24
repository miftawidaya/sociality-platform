import React from 'react';

/**
 * Auth Layout
 * Provides the shared background and container for authentication pages.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-background bg-auth-mesh-mobile md:bg-auth-mesh relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center px-6 py-15 md:py-30'>
      <div className='bg-background/20 border-border md:max-w-auth-card-desktop relative z-10 flex w-full flex-col items-center gap-6 rounded-2xl border p-8 backdrop-blur-xl md:p-10'>
        {children}
      </div>
    </div>
  );
}
