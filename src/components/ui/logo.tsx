import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site-metadata';

/**
 * SVG brand mark
 */
function LogoMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox='0 0 43 43'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22.5 0H19.5V13.2832L14.524 0.967222L11.7425 2.09104L16.8474 14.726L7.21142 5.09009L5.09011 7.21142L14.3257 16.447L2.35706 11.2178L1.15596 13.9669L13.8202 19.5H0V22.5H13.8202L1.15597 28.0331L2.35706 30.7822L14.3257 25.553L5.09011 34.7886L7.21142 36.9098L16.8474 27.274L11.7425 39.909L14.524 41.0327L19.5 28.7169V42H22.5V28.7169L27.476 41.0327L30.2574 39.909L25.1528 27.274L34.7886 36.9098L36.9098 34.7886L27.6742 25.553L39.643 30.7822L40.8439 28.0331L28.1799 22.5H42V19.5H28.1797L40.8439 13.9669L39.643 11.2178L27.6742 16.447L36.9098 7.2114L34.7886 5.09009L25.1528 14.726L30.2574 2.09104L27.476 0.967222L22.5 13.2832V0Z'
        fill='currentColor'
      />
    </svg>
  );
}

const logoVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      full: 'gap-3',
      icon: '',
    },
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'full',
    size: 'default',
  },
});

const iconSizeMap = {
  sm: 'size-5',
  default: 'size-7.5',
  lg: 'size-10',
} as const;

const textSizeMap = {
  sm: 'text-md-bold',
  default: 'display-xs-bold',
  lg: 'display-sm-bold',
} as const;

type LogoProps = Readonly<
  React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof logoVariants>
>;

/**
 * Brand Logo component -- single source of truth for the Sociality brand mark.
 *
 * @example
 * ```tsx
 * <Logo />                          // full + default
 * <Logo variant="icon" size="sm" /> // icon only, small
 * <Logo size="lg" />                // full + large
 * ```
 */
function Logo({
  className,
  variant = 'full',
  size = 'default',
  ...props
}: LogoProps) {
  const resolvedSize = size ?? 'default';

  return (
    <div
      data-slot='logo'
      className={cn(logoVariants({ variant, size, className }))}
      {...props}
    >
      <LogoMark className={iconSizeMap[resolvedSize]} />
      {variant !== 'icon' && (
        <span className={cn(textSizeMap[resolvedSize], 'text-current')}>
          {siteConfig.name}
        </span>
      )}
    </div>
  );
}

export { Logo, LogoMark, logoVariants };
