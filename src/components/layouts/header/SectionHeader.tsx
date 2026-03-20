'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from '@untitledui/icons';
import { cn } from '@/lib/utils';

export type SectionHeaderProps = Readonly<{
  title: string;
  className?: string;
  onBack?: () => void;
}>;

export function SectionHeader({
  title,
  className,
  onBack,
}: SectionHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <button
      type='button'
      onClick={handleBack}
      className={cn(
        'focus-visible:ring-ring flex cursor-pointer items-center gap-2 transition-opacity outline-none hover:opacity-70 focus-visible:ring-2 focus-visible:ring-offset-2',
        className
      )}
      aria-label='Go back'
    >
      <div className='flex size-8 shrink-0 items-center justify-center'>
        <ArrowLeft className='text-foreground size-8' />
      </div>
      <h1 className='text-foreground text-2xl leading-9 font-bold tracking-tight'>
        {title}
      </h1>
    </button>
  );
}
