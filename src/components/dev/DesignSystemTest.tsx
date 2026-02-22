'use client';

/**
 * DesignSystem Component
 *
 * Test component to verify design system tokens from globals.css.
 * This component displays typography, colors, spacing, and radius tokens visually.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/** Neutral color swatches from globals.css */
const NEUTRAL_SWATCHES = [
  { shade: '25', bgClass: 'bg-neutral-25' },
  { shade: '50', bgClass: 'bg-neutral-50' },
  { shade: '100', bgClass: 'bg-neutral-100' },
  { shade: '200', bgClass: 'bg-neutral-200' },
  { shade: '300', bgClass: 'bg-neutral-300' },
  { shade: '400', bgClass: 'bg-neutral-400' },
  { shade: '500', bgClass: 'bg-neutral-500' },
  { shade: '600', bgClass: 'bg-neutral-600' },
  { shade: '700', bgClass: 'bg-neutral-700' },
  { shade: '800', bgClass: 'bg-neutral-800' },
  { shade: '900', bgClass: 'bg-neutral-900' },
  { shade: '950', bgClass: 'bg-neutral-950' },
] as const;

/** Primary color spectrum from globals.css */
const PRIMARY_SWATCHES = [
  { shade: '100', bgClass: 'bg-primary-100' },
  { shade: '200', bgClass: 'bg-primary-200' },
  { shade: '300', bgClass: 'bg-primary-300' },
] as const;

/** Status and functional color swatches from globals.css */
const ACCENT_SWATCHES = [
  { name: 'Red', bgClass: 'bg-accent-red' },
  { name: 'Green', bgClass: 'bg-accent-green' },
  { name: 'Yellow', bgClass: 'bg-accent-yellow' },
] as const;

/** Semantic tokens */
const SEMANTIC_TOKENS = [
  { name: 'Background', bgClass: 'bg-background' },
  { name: 'Foreground', bgClass: 'bg-foreground' },
  { name: 'Card', bgClass: 'bg-card' },
  { name: 'Muted', bgClass: 'bg-muted' },
  { name: 'Accent', bgClass: 'bg-accent' },
  { name: 'Primary', bgClass: 'bg-primary' },
  { name: 'Secondary', bgClass: 'bg-secondary' },
  { name: 'Destructive', bgClass: 'bg-destructive' },
] as const;

/** Spacing scale tokens */
const SPACING_TOKENS = [
  { name: 'xxs', cssValue: '0.125rem', widthClass: 'w-xxs' },
  { name: 'xs', cssValue: '0.25rem', widthClass: 'w-xs' },
  { name: 'sm', cssValue: '0.375rem', widthClass: 'w-sm' },
  { name: 'md', cssValue: '0.5rem', widthClass: 'w-md' },
  { name: 'lg', cssValue: '0.75rem', widthClass: 'w-lg' },
  { name: 'xl', cssValue: '1rem', widthClass: 'w-xl' },
  { name: '2xl', cssValue: '1.25rem', widthClass: 'w-2xl' },
  { name: '3xl', cssValue: '1.5rem', widthClass: 'w-3xl' },
  { name: '4xl', cssValue: '2rem', widthClass: 'w-4xl' },
  { name: '5xl', cssValue: '2.5rem', widthClass: 'w-5xl' },
  { name: '6xl', cssValue: '3rem', widthClass: 'w-6xl' },
  { name: '7xl', cssValue: '4rem', widthClass: 'w-7xl' },
  { name: '8xl', cssValue: '5rem', widthClass: 'w-8xl' },
  { name: '9xl', cssValue: '6rem', widthClass: 'w-9xl' },
  { name: '10xl', cssValue: '8rem', widthClass: 'w-10xl' },
  { name: '11xl', cssValue: '8.75rem', widthClass: 'w-11xl' },
] as const;

/** Border radius tokens */
const RADIUS_TOKENS = [
  { name: 'xxs', radiusClass: 'rounded-xxs' },
  { name: 'xs', radiusClass: 'rounded-xs' },
  { name: 'sm', radiusClass: 'rounded-sm' },
  { name: 'md', radiusClass: 'rounded-md' },
  { name: 'lg', radiusClass: 'rounded-lg' },
  { name: 'xl', radiusClass: 'rounded-xl' },
  { name: '2xl', radiusClass: 'rounded-2xl' },
  { name: '3xl', radiusClass: 'rounded-3xl' },
  { name: '4xl', radiusClass: 'rounded-4xl' },
] as const;

import { DevLayout } from './DevLayout';
import { Logo } from '../ui/logo';

export function DesignSystem({ showLayout = true }: { showLayout?: boolean }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const content = (
    <section
      className={cn(
        'custom-container space-y-10xl',
        showLayout && 'py-10 md:py-20'
      )}
    >
      {/* Typography */}
      <div className='space-y-6xl' aria-labelledby='typography-heading'>
        <h2 id='typography-heading' className='display-sm-bold text-foreground'>
          Typography (Compound Utilities)
        </h2>

        <div className='card space-y-7xl'>
          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Display Sizes
            </h3>
            <div className='space-y-4xl'>
              <p className='display-3xl-extrabold text-foreground'>
                Display 3XL (3.75rem) - Extrabold
              </p>
              <p className='display-2xl-bold text-foreground'>
                Display 2XL (3rem) - Bold
              </p>
              <p className='display-xl-semibold text-foreground'>
                Display XL (2.5rem) - Semibold
              </p>
              <p className='display-lg-medium text-foreground'>
                Display LG (2.25rem) - Medium
              </p>
              <p className='display-md-regular text-foreground'>
                Display MD (2rem) - Regular
              </p>
              <p className='display-sm-regular text-foreground'>
                Display SM (1.75rem) - Regular
              </p>
              <p className='display-xs-regular text-foreground'>
                Display XS (1.5rem) - Regular
              </p>
            </div>
          </div>

          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Body Sizes
            </h3>
            <div className='space-y-4xl'>
              <p className='text-xl-regular text-foreground'>
                Text XL (1.25rem) - Regular
              </p>
              <p className='text-lg-semibold text-foreground'>
                Text LG (1.125rem) - Semibold
              </p>
              <p className='text-md-medium text-foreground'>
                Text MD (1rem) - Medium
              </p>
              <p className='text-sm-regular text-foreground'>
                Text SM (0.875rem) - Regular
              </p>
              <p className='text-xs-regular text-foreground'>
                Text XS (0.75rem) - Regular
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className='space-y-6xl' aria-labelledby='colors-heading'>
        <h2 id='colors-heading' className='display-sm-bold text-foreground'>
          Colors
        </h2>

        <div className='card space-y-7xl'>
          <div className='space-y-4xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Primary Palette
            </h3>
            <div className='flex flex-wrap gap-4'>
              {PRIMARY_SWATCHES.map((swatch) => (
                <figure key={swatch.shade} className='space-y-2'>
                  <div
                    className={cn(
                      'size-20 rounded-xl border shadow-sm',
                      swatch.bgClass
                    )}
                  />
                  <figcaption className='text-text-xs-medium text-muted-foreground text-center uppercase'>
                    {swatch.shade}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className='space-y-4xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Neutral Scale
            </h3>
            <div className='flex flex-wrap gap-4'>
              {NEUTRAL_SWATCHES.map((swatch) => (
                <figure key={swatch.shade} className='space-y-2'>
                  <div
                    className={cn(
                      'size-20 rounded-xl border shadow-sm',
                      swatch.bgClass
                    )}
                  />
                  <figcaption className='text-text-xs-medium text-muted-foreground text-center uppercase'>
                    {swatch.shade}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className='space-y-4xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Semantic & Accents
            </h3>
            <div className='flex flex-wrap gap-6'>
              {SEMANTIC_TOKENS.map((token) => (
                <figure key={token.name} className='space-y-2'>
                  <div
                    className={cn(
                      'size-20 rounded-xl border shadow-sm',
                      token.bgClass
                    )}
                  />
                  <figcaption className='text-text-xs-medium text-muted-foreground text-center'>
                    {token.name}
                  </figcaption>
                </figure>
              ))}
              {ACCENT_SWATCHES.map((swatch) => (
                <figure key={swatch.name} className='space-y-2'>
                  <div
                    className={cn(
                      'size-20 rounded-xl shadow-sm',
                      swatch.bgClass
                    )}
                  />
                  <figcaption className='text-text-xs-medium text-muted-foreground text-center'>
                    {swatch.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className='space-y-6xl' aria-labelledby='spacing-heading'>
        <h2 id='spacing-heading' className='display-sm-bold text-foreground'>
          Spacing
        </h2>

        <div className='card space-y-4xl'>
          <div className='space-y-3'>
            {SPACING_TOKENS.map((spacing) => (
              <div key={spacing.name} className='flex items-center gap-6'>
                <span className='text-text-sm-medium text-muted-foreground w-12'>
                  {spacing.name}
                </span>
                <div
                  className={cn(
                    'bg-primary/20 border-primary/30 h-6 border-x',
                    spacing.widthClass
                  )}
                />
                <span className='text-text-xs-regular text-muted-foreground italic opacity-70'>
                  {spacing.cssValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radius */}
      <div className='space-y-6xl' aria-labelledby='radius-heading'>
        <h2 id='radius-heading' className='display-sm-bold text-foreground'>
          Border Radius
        </h2>

        <div className='card'>
          <div className='flex flex-wrap gap-8'>
            {RADIUS_TOKENS.map((radius) => (
              <figure key={radius.name} className='space-y-3'>
                <div
                  className={cn(
                    'bg-primary/10 border-primary/20 size-24 border-2',
                    radius.radiusClass
                  )}
                />
                <figcaption className='text-text-sm-medium text-muted-foreground text-center'>
                  {radius.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Components */}
      <div className='space-y-6xl' aria-labelledby='interactive-heading'>
        <h2
          id='interactive-heading'
          className='display-sm-bold text-foreground'
        >
          Interactive Elements
        </h2>

        <div className='card space-y-8xl'>
          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Button Variants
            </h3>
            <div className='flex flex-wrap items-center gap-6'>
              <Button variant='default'>Primary</Button>
              <Button variant='secondary'>Secondary</Button>
              <Button variant='outline'>Outline</Button>
              <Button variant='ghost'>Ghost</Button>
              <Button variant='destructive'>Destructive</Button>
            </div>
          </div>

          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Button Sizes
            </h3>
            <div className='flex flex-wrap items-center gap-6'>
              <Button size='sm'>Small</Button>
              <Button size='default'>Default</Button>
              <Button size='lg'>Large</Button>
              <Button size='icon' className='rounded-full'>
                +
              </Button>
            </div>
          </div>

          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Input States
            </h3>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-2'>
                <p className='text-foreground/70 text-sm'>Default</p>
                <Input placeholder='Enter text here...' />
              </div>
              <div className='space-y-2'>
                <p className='text-foreground/70 text-sm'>Disabled</p>
                <Input disabled placeholder='Not allowed' />
              </div>
              <div className='space-y-2'>
                <p className='text-foreground/70 text-sm'>Error State</p>
                <Input
                  aria-invalid={true}
                  placeholder='Invalid value'
                  defaultValue='wrong text'
                />
                <p className='text-destructive mt-1 text-xs'>
                  Please enter a valid value.
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-foreground/70 text-sm'>File Upload</p>
                <Input type='file' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Components */}
      <div className='space-y-6xl' aria-labelledby='logo-heading'>
        <h2 id='logo-heading' className='display-sm-bold text-foreground'>
          Logo (Single SVG with CSS Color Control)
        </h2>

        <div className='card space-y-7xl'>
          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Brand Colored (text-primary)
            </h3>
            <span className='text-primary inline-block'>
              <Logo className='size-10' />
            </span>
          </div>

          <div className='space-y-6xl'>
            <h3 className='text-text-lg-semibold text-muted-foreground tracking-widest uppercase'>
              Base Color (text-foreground)
            </h3>
            <span className='text-foreground inline-block'>
              <Logo className='size-10' />
            </span>
          </div>
        </div>
      </div>
    </section>
  );

  if (!showLayout) return content;

  return (
    <DevLayout
      title='Design System Test'
      description='Verifying Tailwind v4 CSS-First tokens and custom text utilities'
      codeSnippet='globals.css'
    >
      {content}
    </DevLayout>
  );
}
