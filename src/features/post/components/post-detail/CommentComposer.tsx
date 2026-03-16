'use client';

import * as React from 'react';
import { Icon } from '@iconify/react';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import { cn } from '@/lib/utils';

type CommentComposerProps = Readonly<{
  onSubmit: (content: string) => void;
  isPending: boolean;
  className?: string;
}>;

export function CommentComposer({
  onSubmit,
  isPending,
  className,
}: CommentComposerProps) {
  const [value, setValue] = React.useState('');
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const pickerRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0 || isPending) return;
    onSubmit(trimmed);
    setValue('');
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setValue((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Close picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const isDisabled = value.trim().length === 0 || isPending;

  return (
    <div className={cn('relative flex flex-row items-start gap-2', className)}>
      <div className='relative' ref={pickerRef}>
        <button
          type='button'
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label='Emoji'
          className='border-border hover:bg-accent hover:text-accent-foreground flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-colors'
        >
          <Icon icon='prime:face-smile' className='text-foreground size-5.5' />
          <span className='sr-only'>Emoji picker</span>
        </button>

        {showEmojiPicker && (
          <div className='animate-modal-in absolute bottom-14 left-0 z-50'>
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.DARK}
              lazyLoadEmojis={true}
              searchPlaceHolder='Search emoji...'
              width={320}
              height={400}
            />
          </div>
        )}
      </div>

      <div className='bg-card border-border flex grow flex-row items-center gap-2 rounded-xl border px-4 py-2 h-12'>
        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Add Comment'
          disabled={isPending}
          className='text-md-medium placeholder:text-muted-foreground grow bg-transparent outline-none text-foreground'
          aria-label='Add Comment'
        />

        <button
          type='button'
          onClick={handleSubmit}
          disabled={isDisabled}
          className={cn(
            'text-sm-bold shrink-0 tracking-[-0.01em] transition-colors',
            isDisabled
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-primary cursor-pointer hover:opacity-80'
          )}
        >
          Post
        </button>
      </div>
    </div>
  );
}
