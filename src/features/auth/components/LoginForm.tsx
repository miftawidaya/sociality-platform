'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { loginSchema } from '@/features/auth/validations/auth';
import { ROUTES } from '@/config/routes';
import { useLoginMutation } from '../hooks/useLoginMutation';
import type { LoginInput } from '@/features/auth/types';
import { useState } from 'react';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') ?? ROUTES.FEED;

  const {
    mutate: login,
    isPending,
    isSuccess,
    error: serverError,
  } = useLoginMutation({ callbackUrl });

  const isLoading = isPending || isSuccess;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <>
      <Logo />

      <h1 className='display-xs-bold text-foreground text-center'>
        Welcome back
      </h1>

      <form
        method='POST'
        action=''
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-6'
      >
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='login-email'
              className='text-sm-bold text-foreground tracking-tight'
            >
              Email
            </label>
            <Input
              id='login-email'
              type='email'
              placeholder='Enter your email'
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              className='border-border bg-background'
            />
            {errors.email && (
              <p className='text-sm-medium text-destructive'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='login-password'
              className='text-sm-bold text-foreground tracking-tight'
            >
              Password
            </label>
            <div className='relative'>
              <Input
                id='login-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
                className='border-border bg-background pe-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500 hover:text-white'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                <span className='sr-only'>
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className='text-sm-medium text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {serverError && (
          <div className='bg-destructive/10 text-destructive text-sm-medium rounded-lg p-3 text-center'>
            {serverError.message}
          </div>
        )}

        <div className='flex flex-col items-center gap-4'>
          <Button
            type='submit'
            disabled={isLoading}
            className='text-md-bold h-12 w-full rounded-full'
          >
            {isLoading ? (
              <>
                <Loader2 className='me-2 h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <div className='text-md-medium flex items-center gap-1'>
            <span className='text-foreground'>Don&apos;t have an account?</span>
            <Link
              href={ROUTES.REGISTER}
              className='text-primary hover:text-primary-200 font-bold'
            >
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

/**
 * LoginForm with Suspense boundary.
 * Required by Next.js for components using useSearchParams.
 */
export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormContent />
    </Suspense>
  );
}
