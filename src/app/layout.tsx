import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@/styles/globals.css';
import { siteMetadata } from '@/config/site-metadata';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/dev';
import { Providers } from './providers';

const fontSans = localFont({
  src: [
    {
      path: '../assets/fonts/sf-pro-display-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-display-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-display-semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-display-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-display-heavy.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
});

const fontMono = localFont({
  src: [
    {
      path: '../assets/fonts/sfmono-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sfmono-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className='dark'
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <head />
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers>
          <main>{children}</main>
          <ThemeSwitcher />
        </Providers>
      </body>
    </html>
  );
}
