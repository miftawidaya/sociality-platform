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

import {
  Home2,
  Archive,
  Profile,
  Element4,
  Send2,
  Heart,
  Message,
  Grid4,
  Bookmark,
  Grid3,
} from 'iconsax-react';

import { cn } from '@/lib/utils';

type IconItem = Readonly<{
  name: string;
  Icon?: React.ElementType; // For @untitledui/icons components
  iconName?: string; // For @iconify/react strings
  className?: string;
}>;

const UNTITLED_ICONS: IconItem[] = [
  { name: 'Calendar', Icon: Calendar },
  { name: 'ChevronDown', Icon: ChevronDown },
  { name: 'SearchLg', Icon: SearchLg },
  { name: 'Pencil02', Icon: Pencil02 },
  { name: 'FilterLines', Icon: FilterLines },
  { name: 'XClose', Icon: XClose },
  { name: 'CheckCircle', Icon: CheckCircle },
  { name: 'Trash03', Icon: Trash03 },
  { name: 'Pin02', Icon: Pin02 },
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
  { name: 'ArrowCircleBrokenLeft', Icon: ArrowCircleBrokenLeft },
  { name: 'MarkerPin01', Icon: MarkerPin01 },
];

const ICONIFY_ICONS: IconItem[] = [
  { name: 'X (Close)', iconName: 'icon-park-solid:close-one' },
  { name: 'LetsIconsBagFill (Bag)', iconName: 'lets-icons:bag-fill' },
  {
    name: 'Star (Filled #FFAB0D)',
    iconName: 'ri:star-fill',
    className: 'text-rating',
  },
];

const VUESAX_ICONS: IconItem[] = [
  { name: 'Home (Bold)', Icon: Home2, className: 'variant-Bold' },
  { name: 'Saved (Archive) (Bold)', Icon: Archive, className: 'variant-Bold' },
  { name: 'Profile (User) (Bold)', Icon: Profile, className: 'variant-Bold' },

  { name: 'Gallery (Element4)', Icon: Element4, className: 'variant-Linear' },
  { name: 'Profile (User)', Icon: Profile, className: 'variant-Linear' },
  { name: 'Share (Send2)', Icon: Send2, className: 'variant-Linear' },

  { name: 'Love (Heart) (Bold)', Icon: Heart, className: 'variant-Bold' },
  { name: 'Heart (Linear)', Icon: Heart, className: 'variant-Linear' },
  {
    name: 'Save (Archive) (Linear)',
    Icon: Archive,
    className: 'variant-Linear',
  },

  { name: 'Message', Icon: Message, className: 'variant-Linear' },
  {
    name: 'Grid (Solid)',
    Icon: Grid3,
    className: 'variant-Bold',
  },
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
          id='untitled-ui-heading'
          className='display-sm-bold text-foreground'
        >
          Untitled UI Icons
        </h2>

        <div className='card'>
          <div className='gap-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5'>
            {UNTITLED_ICONS.map(({ name, Icon: IconComp, className }) => (
              <div
                key={name}
                className='gap-md bg-card-foreground/5 p-xl hover:bg-card-foreground/10 flex flex-col items-center justify-center rounded-xl transition-colors'
              >
                {IconComp && (
                  <IconComp
                    className={cn('text-foreground size-6', className)}
                    aria-hidden='true'
                    strokeWidth={2}
                  />
                )}
                <span className='text-muted-foreground text-center text-xs'>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <h2 className='display-sm-bold text-foreground mt-12'>Iconify Icons</h2>

        <div className='card'>
          <div className='gap-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5'>
            {ICONIFY_ICONS.map(({ name, iconName, className }) => (
              <div
                key={name}
                className='gap-md bg-card-foreground/5 p-xl hover:bg-card-foreground/10 flex flex-col items-center justify-center rounded-xl transition-colors'
              >
                <Icon
                  icon={iconName || ''}
                  className={cn('text-foreground size-6', className)}
                  aria-hidden='true'
                />
                <span className='text-muted-foreground text-center text-xs'>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <h2 className='display-sm-bold text-foreground mt-12'>Vuesax Icons</h2>

        <div className='card'>
          <div className='gap-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5'>
            {VUESAX_ICONS.map(({ name, Icon: IconComp, className }) => {
              const variant = className?.includes('Bold') ? 'Bold' : 'Linear';
              return (
                <div
                  key={name}
                  className='gap-md bg-card-foreground/5 p-xl hover:bg-card-foreground/10 flex flex-col items-center justify-center rounded-xl transition-colors'
                >
                  {IconComp && (
                    <IconComp
                      variant={variant}
                      size={24}
                      color='currentColor'
                      className={cn('text-foreground')}
                      aria-hidden='true'
                    />
                  )}
                  <span className='text-muted-foreground text-center text-xs'>
                    {name}
                  </span>
                </div>
              );
            })}
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
