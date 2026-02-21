import { Metadata } from 'next';
import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Sociality',
  role: 'High-Performance Social Infrastructure Template',
  techStack: 'Next.js 16, TypeScript, Tailwind CSS v4',
  shortDescription:
    'A gold-standard open-source social media platform template built with Next.js 16 and Tailwind CSS v4.',
  fullDescription:
    'Sociality is a high-performance, modular social infrastructure project designed as a benchmark for modern web engineering. Built with Next.js 16, Tailwind CSS v4, and Feature-Sliced Design principles.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/og-image.jpg`,
  links: {
    twitter: 'https://twitter.com/sociality_app',
    github: 'https://github.com/sociality/sociality',
  },
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.role} — ${siteConfig.techStack}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.fullDescription,
  keywords: [
    'Social Media Management Template',
    'Next.js 16 Showcase',
    'Tailwind CSS v4 Project',
    'Feature-Sliced Design',
    'FSD Architecture',
    'Social Infrastructure',
    'Open Source Sociality',
    'Modern Web Engineering',
  ],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.shortDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.role}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.shortDescription,
    images: ['/og-image.jpg'],
    creator: `@${siteConfig.links.twitter.split('/').pop() ?? 'sociality_app'}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};
