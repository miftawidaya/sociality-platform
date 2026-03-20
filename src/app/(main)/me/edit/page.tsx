'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SectionHeader } from '@/components/layouts/header/SectionHeader';
import { PageHeader } from '@/components/layouts/header/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  useMyProfile,
  useUpdateProfile,
} from '@/features/profile/queries/profile.queries';
import { useEditProfileForm } from '@/features/profile/hooks/useEditProfileForm';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function EditProfilePage() {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { data: profile, isLoading: isProfileLoading } =
    useMyProfile(isAuthenticated);
  const updateProfile = useUpdateProfile();

  const user = profile?.profile;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useEditProfileForm(
    user ?? {
      id: 0,
      name: '',
      username: '',
      avatarUrl: null,
    }
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        bio: user.bio ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
      });
      setAvatarPreview(user.avatarUrl);
    }
  }, [user, reset]);

  if (isProfileLoading) {
    return (
      <div className='bg-background flex min-h-screen flex-col items-center pb-10'>
        <PageHeader title='Edit Profile' backTo='/me' className='md:hidden' />
        <main className='mt-6 flex w-full flex-col px-4 md:mt-10 md:w-200 md:px-0'>
          <div className='hidden items-center gap-3 md:flex md:gap-3'>
            <div className='bg-muted h-8 w-8 animate-pulse rounded-full'></div>
            <div className='bg-muted h-9 w-40 animate-pulse rounded-lg'></div>
          </div>
          <div className='mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:gap-12'>
            <div className='flex flex-col items-center gap-4 md:w-40 md:shrink-0'>
              <div className='bg-muted size-20 animate-pulse rounded-full md:size-32.5'></div>
              <div className='bg-muted h-10 w-40 animate-pulse rounded-full md:h-12'></div>
            </div>
            <div className='flex flex-1 flex-col gap-4 md:gap-6'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='flex flex-col gap-2'>
                  <div className='bg-muted h-4 w-20 animate-pulse rounded'></div>
                  <div className='bg-muted h-12 w-full animate-pulse rounded-xl'></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    // Include avatarUrl from profile data as required by the API curl example
    const payload = {
      ...data,
      avatarUrl: user.avatarUrl || 'string',
      avatarPreview: avatarPreview, // Passed solely for optimistic UI
    };

    // If no new avatar selected, don't send the avatar field as empty string
    if (!payload.avatar) {
      delete payload.avatar;
    }

    // Trigger mutation without waiting (optimistic)
    updateProfile.mutate(payload);

    // Redirect instantly
    router.push('/me');
  };

  return (
    <div className='bg-background flex min-h-screen flex-col items-center pb-10'>
      <PageHeader title='Edit Profile' backTo='/me' className='md:hidden' />
      <main className='mt-6 flex w-full flex-col px-4 md:mt-10 md:w-200 md:px-0'>
        {/* Desktop Header Logic (Hidden on Mobile) */}
        <SectionHeader title='Edit Profile' className='hidden md:flex' />

        {/* Form Body (Frame 1618874006) */}
        <div className='mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:gap-12'>
          {/* Avatar Section (Left) (Frame 1618874004) */}
          <div className='flex flex-col items-center gap-4 md:w-40 md:shrink-0'>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              accept='image/*'
              onChange={handleAvatarChange}
            />
            <Avatar className='border-border size-20 md:size-32.5'>
              <AvatarImage src={avatarPreview || undefined} alt={user.name} />
              <AvatarFallback className='text-2xl font-bold'>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              type='button'
              variant='outline'
              onClick={() => fileInputRef.current?.click()}
              className='text-sm-bold md:text-md-bold border-input text-foreground md:text-16px h-10 w-40 rounded-full bg-transparent md:h-12 md:w-40'
            >
              Change Photo
            </Button>
          </div>

          {/* Inputs Section (Right) (Frame 1618874005) */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-1 flex-col gap-4 md:gap-6'
          >
            {/* Name Input */}
            <div className='flex flex-col gap-0.5 md:h-19.5'>
              <label
                htmlFor='name'
                className='text-sm-bold text-foreground leading-7 md:h-7 md:text-sm md:leading-7'
              >
                Name
              </label>
              <div className='border-input bg-card flex h-12 w-full items-center rounded-xl border px-4'>
                <input
                  id='name'
                  {...register('name')}
                  placeholder='Your name'
                  className='text-md-semibold placeholder:text-muted-foreground text-foreground md:text-md size-full bg-transparent leading-7.5 outline-none md:leading-7.5'
                />
              </div>
              {errors.name && (
                <p className='text-xs-regular text-destructive'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Username Input */}
            <div className='flex flex-col gap-0.5 md:h-19.5'>
              <label
                htmlFor='username'
                className='text-sm-bold text-foreground leading-7 md:h-7 md:text-sm md:leading-7'
              >
                Username
              </label>
              <div className='border-input bg-card flex h-12 w-full items-center rounded-xl border px-4'>
                <input
                  id='username'
                  {...register('username')}
                  placeholder='Your username'
                  className='text-md-semibold placeholder:text-muted-foreground text-foreground md:text-md size-full bg-transparent leading-7.5 outline-none md:leading-7.5'
                />
              </div>
              {errors.username && (
                <p className='text-xs-regular text-destructive'>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className='flex flex-col gap-0.5 md:h-19.5'>
              <label
                htmlFor='email'
                className='text-sm-bold text-foreground leading-7 md:h-7 md:text-sm md:leading-7'
              >
                Email
              </label>
              <div className='border-input bg-card flex h-12 w-full items-center rounded-xl border px-4'>
                <input
                  id='email'
                  type='email'
                  {...register('email')}
                  placeholder='Email'
                  className='text-md-semibold placeholder:text-muted-foreground text-foreground md:text-md size-full bg-transparent leading-7.5 outline-none md:leading-7.5'
                />
              </div>
              {errors.email && (
                <p className='text-xs-regular text-destructive'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className='flex flex-col gap-0.5 md:h-19.5'>
              <label
                htmlFor='phone'
                className='text-sm-bold text-foreground leading-7 md:h-7 md:text-sm md:leading-7'
              >
                Phone
              </label>
              <div className='border-input bg-card flex h-12 w-full items-center rounded-xl border px-4'>
                <input
                  id='phone'
                  {...register('phone')}
                  placeholder='Phone'
                  className='text-md-semibold placeholder:text-muted-foreground text-foreground md:text-md size-full bg-transparent leading-7.5 outline-none md:leading-7.5'
                />
              </div>
              {errors.phone && (
                <p className='text-xs-regular text-destructive'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Bio Texarea */}
            <div className='flex flex-col gap-0.5 md:h-32.75'>
              <label
                htmlFor='bio'
                className='text-sm-bold text-foreground leading-7 md:h-7 md:text-sm md:leading-7'
              >
                Bio
              </label>
              <div className='border-input bg-card flex h-25.25 w-full items-start rounded-xl border px-4 py-2 md:h-25.25'>
                <textarea
                  id='bio'
                  {...register('bio')}
                  placeholder='Type bio here'
                  className='text-md-regular placeholder:text-muted-foreground text-foreground md:text-md size-full resize-none bg-transparent leading-7.5 outline-none md:leading-7.5'
                />
              </div>
              {errors.bio && (
                <p className='text-xs-regular text-destructive'>
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={updateProfile.isPending}
              className='bg-primary text-primary-foreground md:text-md mt-2 h-10 w-full rounded-full font-bold hover:opacity-90 md:h-12 md:leading-7.5'
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
