import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Extend tailwind-merge so that our custom typography classes
// (like text-sm-bold, text-md-regular) don't conflict with text colors.
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'xl-regular',
            'xl-medium',
            'xl-semibold',
            'xl-bold',
            'xl-extrabold',
            'lg-regular',
            'lg-medium',
            'lg-semibold',
            'lg-bold',
            'lg-extrabold',
            'md-regular',
            'md-medium',
            'md-semibold',
            'md-bold',
            'md-extrabold',
            'sm-regular',
            'sm-medium',
            'sm-semibold',
            'sm-bold',
            'sm-extrabold',
            'xs-regular',
            'xs-medium',
            'xs-semibold',
            'xs-bold',
            'xs-extrabold',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
