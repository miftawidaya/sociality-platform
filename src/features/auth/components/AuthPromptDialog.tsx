'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogoMark } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export type PendingAction = {
  action: 'like' | 'save';
  postId: number;
};

type AuthPromptDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  pendingAction?: PendingAction | null;
  title?: string;
  description?: string;
}>;

/**
 * Reusable dialog that prompts unauthenticated users to login or register
 * when they attempt an authenticated action (like/save).
 * Mimics Instagram's native auth wall behavior and uses semantic HTML <dialog>.
 */
export function AuthPromptDialog({
  open,
  onClose,
  pendingAction,
  title = 'Log in to continue',
  description = 'Please log in or register to interact with posts.',
}: AuthPromptDialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [isDismissing, setIsDismissing] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClose = React.useCallback(() => {
    setIsDismissing(true);
    setTimeout(() => {
      onClose();
      setIsDismissing(false);
    }, 200); // matching animate-modal-out duration
  }, [onClose]);

  // Handle native ESC key close
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      handleClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [handleClose]);

  const handleAuthRedirect = (route: string) => {
    if (pendingAction) {
      sessionStorage.setItem(
        'pendingAuthAction',
        JSON.stringify(pendingAction)
      );
    }
    router.push(`${route}?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'backdrop:bg-background/80 backdrop:backdrop-blur-sm',
        isDismissing
          ? 'backdrop:animate-overlay-out'
          : 'backdrop:animate-overlay-in',
        'bg-card text-card-foreground m-auto flex-col shadow-lg open:flex',
        'w-[calc(100%-2rem)] max-w-100 rounded-xl p-0',
        'border-border border',
        isDismissing ? 'animate-modal-out' : 'open:animate-modal-in',
        'ease-smooth-out transition-all duration-300'
      )}
      onClick={(e) => {
        // Close if clicking on the backdrop area outside the dialog content
        if (e.target === dialogRef.current) handleClose();
      }}
      aria-labelledby='auth-prompt-title'
      aria-describedby='auth-prompt-description'
    >
      <div className='flex justify-end p-2'>
        <button
          type='button'
          onClick={handleClose}
          className='text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer rounded-full p-2 transition-colors'
          aria-label='Close auth prompt'
        >
          <X className='size-6' />
        </button>
      </div>

      <div className='flex flex-col items-center justify-center px-8 pb-10 text-center'>
        <div className='border-border bg-muted mb-6 flex size-20 shrink-0 items-center justify-center rounded-full border'>
          <LogoMark className='text-foreground size-11 shrink-0' />
        </div>

        <h2
          id='auth-prompt-title'
          className='mb-2 text-xl font-bold tracking-tight'
        >
          {title}
        </h2>
        <p
          id='auth-prompt-description'
          className='text-muted-foreground mb-8 text-sm'
        >
          {description}
        </p>

        <div className='flex w-full flex-col gap-3'>
          <Button
            size='lg'
            className='text-md-bold w-full'
            onClick={() => handleAuthRedirect(ROUTES.LOGIN)}
          >
            Log in
          </Button>
          <Button
            variant='outline'
            size='lg'
            className='text-md-bold w-full bg-transparent'
            onClick={() => handleAuthRedirect(ROUTES.REGISTER)}
          >
            Sign up for Sociality
          </Button>
        </div>
      </div>
    </dialog>
  );
}
