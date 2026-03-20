'use client';

import { InfoIcon, Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <div className='pointer-events-none fixed inset-x-0 top-0 z-9999 flex justify-center'>
      <div className='custom-container relative h-px w-full'>
        <Sonner
          {...props}
          theme={theme as ToasterProps['theme']}
          position='top-right'
          className='absolute! inset-x-4! top-22! h-auto! w-auto! md:inset-x-6! md:top-28! xl:inset-x-8!'
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                'w-full! sm:w-72.5! h-10 bg-accent-green text-white border-none shadow-card p-0 px-3 gap-2 flex items-center rounded-lg pointer-events-auto',
              content: 'p-0 flex-1 order-0',
              title: 'text-white text-sm-semibold leading-7 tracking-tight m-0',
              closeButton:
                'static inset-auto transform-none order-1 bg-transparent! hover:bg-transparent! border-none text-white opacity-100 size-4 flex items-center justify-center p-0 m-0 shrink-0 cursor-pointer shadow-none',
              error: 'bg-destructive',
            },
          }}
          closeButton={true}
          icons={{
            success: null,
            error: null,
            info: <InfoIcon className='size-4' />,
            warning: <TriangleAlertIcon className='size-4' />,
            loading: <Loader2Icon className='size-4 animate-spin' />,
          }}
        />
      </div>
    </div>
  );
};

export { Toaster };
