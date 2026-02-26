'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

function Avatar({
  className,
  size = 'default',
  ...props
}: Readonly<
  React.ComponentProps<typeof AvatarPrimitive.Root> & {
    size?: 'default' | 'sm' | 'lg';
  }
>) {
  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      data-size={size}
      className={cn(
        'group/avatar relative flex size-10 shrink-0 overflow-hidden rounded-full select-none data-size-lg:size-12 data-size-sm:size-8',
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof AvatarPrimitive.Image>>) {
  return (
    <AvatarPrimitive.Image
      data-slot='avatar-image'
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof AvatarPrimitive.Fallback>>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn(
        'bg-primary/20 text-primary text-md-bold group-data-size-sm/avatar:text-sm-bold flex size-full items-center justify-center rounded-full',
        className
      )}
      {...props}
    />
  );
}

function AvatarBadge({
  className,
  ...props
}: Readonly<React.ComponentProps<'span'>>) {
  return (
    <span
      data-slot='avatar-badge'
      className={cn(
        'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none',
        'group-data-size-sm/avatar:size-2 group-data-size-sm/avatar:[&>svg]:hidden',
        'group-data-size-default/avatar:size-2.5 group-data-size-default/avatar:[&>svg]:size-2',
        'group-data-size-lg/avatar:size-3 group-data-size-lg/avatar:[&>svg]:size-2',
        className
      )}
      {...props}
    />
  );
}

function AvatarGroup({
  className,
  ...props
}: Readonly<React.ComponentProps<'div'>>) {
  return (
    <div
      data-slot='avatar-group'
      className={cn(
        '*:data-slot-avatar:ring-background group/avatar-group flex -space-x-2 *:data-slot-avatar:ring-2',
        className
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: Readonly<React.ComponentProps<'div'>>) {
  return (
    <div
      data-slot='avatar-group-count'
      className={cn(
        'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-size-lg/avatar-group:size-10 group-has-data-size-sm/avatar-group:size-6 [&>svg]:size-4 group-has-data-size-lg/avatar-group:[&>svg]:size-5 group-has-data-size-sm/avatar-group:[&>svg]:size-3',
        className
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
