/**
 * IconTest Component
 *
 * Test component to verify Untitled UI icons and Iconify icons according to .
 * This component displays icons from @untitledui/icons and @iconify/react.
 *
 * @remarks
 * For development and testing purposes only.
 */

import { Icon } from '@iconify/react';
import {
  Calendar,
  ChevronDown,
  SearchLg,
  Pencil02,
  FilterLines,
  XClose,
  CheckCircle,
  Trash03,
  Pin02,
  DotsHorizontal,
  Sun,
  Moon02,
  Plus,
  SearchMd,
  Eye,
  EyeOff,
  ShoppingCart01,
  Share07,
  File05,
  Minus,
  Star01,
  ArrowCircleBrokenLeft,
  MarkerPin01,
} from '@untitledui/icons';

import { cn } from '@/lib/utils';

type IconItem = Readonly<{
  name: string;
  Icon?: React.ElementType; // For @untitledui/icons components
  iconName?: string; // For @iconify/react strings
  className?: string;
}>;

const ICONS: IconItem[] = [
  { name: 'Calendar', Icon: Calendar },
  { name: 'ChevronDown', Icon: ChevronDown },
  { name: 'SearchLg', Icon: SearchLg },
  { name: 'Pencil02', Icon: Pencil02 },
  { name: 'FilterLines', Icon: FilterLines },
  { name: 'XClose', Icon: XClose },
  { name: 'CheckCircle', Icon: CheckCircle },
  { name: 'Trash03', Icon: Trash03 },
  { name: 'Pin02', Icon: Pin02 },
  { name: 'X (Close)', iconName: 'icon-park-solid:close-one' },
  { name: 'DotsHorizontal (More)', Icon: DotsHorizontal },
  { name: 'Sun', Icon: Sun },
  { name: 'Moon02', Icon: Moon02 },
  { name: 'Plus (Add)', Icon: Plus },
  { name: 'SearchMd', Icon: SearchMd },
  { name: 'Eye', Icon: Eye },
  { name: 'EyeOff', Icon: EyeOff },
  { name: 'ShoppingCart01 (Cart)', Icon: ShoppingCart01 },
  { name: 'Share07 (Share)', Icon: Share07 },
  { name: 'File05', Icon: File05 },
  { name: 'Minus', Icon: Minus },
  { name: 'Star01 (Outline)', Icon: Star01 },
  {
    name: 'Star01 (Filled #FFAB0D)',
    Icon: Star01,
    className: 'fill-rating text-rating',
  },
  { name: 'ArrowCircleBrokenLeft', Icon: ArrowCircleBrokenLeft },
  { name: 'MarkerPin01', Icon: MarkerPin01 },
  { name: 'LetsIconsBagFill (Bag)', iconName: 'lets-icons:bag-fill' },
];

import { DevLayout } from './DevLayout';

export function IconTest({ showLayout = true }: { showLayout?: boolean }) {
  const content = (
    <section
      className={cn(
        'custom-container space-y-10xl',
        showLayout && 'py-10 md:py-20'
      )}
      aria-labelledby='icon-system-heading'
    >
      <div className='space-y-6xl'>
        <h2
          id='icon-system-heading'
          className='display-sm-bold text-foreground'
        >
          Icon System (Untitled UI & Iconify)
        </h2>

        <div className='card'>
          <div className='gap-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5'>
            {ICONS.map(({ name, Icon: IconComp, iconName, className }) => (
              <div
                key={name}
                className='gap-md bg-card-foreground/5 p-xl hover:bg-card-foreground/10 flex flex-col items-center justify-center rounded-xl transition-colors'
              >
                {IconComp ? (
                  <IconComp
                    className={cn('text-foreground size-6', className)}
                    aria-hidden='true'
                    strokeWidth={2}
                  />
                ) : (
                  <Icon
                    icon={iconName || ''}
                    className={cn('text-foreground size-6', className)}
                    aria-hidden='true'
                  />
                )}
                <span className='text-muted-foreground text-center text-xs'>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  if (!showLayout) return content;

  return (
    <DevLayout
      title='Icon System Test'
      description='Verify icons from Untitled UI and Iconify'
    >
      {content}
    </DevLayout>
  );
}
