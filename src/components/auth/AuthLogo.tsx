import { Logo } from '@/components/ui/logo';

export function AuthLogo() {
  return (
    <div className='flex items-center gap-3'>
      <Logo className='text-foreground size-7.5' />
      <span className='text-display-xs text-foreground font-bold'>
        Sociality
      </span>
    </div>
  );
}
