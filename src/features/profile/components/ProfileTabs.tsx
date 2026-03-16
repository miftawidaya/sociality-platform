import { cn } from '@/lib/utils';
import * as React from 'react';

export type ProfileTabId = 'posts' | 'saved' | 'likes';

export interface ProfileTabItem {
  id: ProfileTabId;
  label: string;
  icon: React.ElementType;
}

type ProfileTabsProps = Readonly<{
  tabs: ProfileTabItem[];
  activeTab: ProfileTabId;
  onTabChange: (tabId: ProfileTabId) => void;
}>;

export function ProfileTabs({
  tabs,
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <div className='border-border flex w-full flex-row items-center border-b'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type='button'
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex h-12 flex-1 cursor-pointer flex-row items-center justify-center gap-2 px-6 transition-colors',
              isActive
                ? 'border-foreground border-b-2'
                : 'hover:border-border border-b border-transparent'
            )}
            aria-selected={isActive}
            role='tab'
          >
            <Icon
              color='currentColor'
              variant={isActive ? 'Bold' : 'Linear'}
              className={cn(
                'size-5 md:size-6',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-sm-medium md:text-md-medium',
                isActive ? 'text-foreground font-bold' : 'text-muted-foreground'
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
