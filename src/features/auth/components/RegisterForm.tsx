'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { registerSchema } from '@/features/auth/validations/auth';
import { ROUTES } from '@/config/routes';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import type { RegisterInput } from '@/features/auth/types';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    mutate: registerUser,
    isPending,
    isSuccess,
    error: serverError,
  } = useRegisterMutation();

  const isLoading = isPending || isSuccess;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    registerUser(data);
  };

  return (
    <>
      <Logo />

      <h1 className='display-xs-bold text-foreground text-center'>Register</h1>

      <form
        method='POST'
        action=''
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-6'
      >
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='register-name'
              className='text-sm-bold text-foreground tracking-tight'
            >
              Name
            </label>
            <Input
              id='register-name'
              placeholder='Enter your name'
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
              className='border-border bg-background'
            />
            {errors.name && (
              <p className='text-sm-medium text-destructive'>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='register-username'
              className='text-sm-bold text-foreground tracking-tight'
            >
              Username
            </label>
            <Input
              id='register-username'
              placeholder='Enter your username'
              {...register('username')}
              aria-invalid={errors.username ? 'true' : 'false'}
              className='border-border bg-background'
            />
            {errors.username && (
              <p className='text-sm-medium text-destructive'>
                {errors.username.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='register-email'
              className='text-sm-bold text-foreground tracking-tight'
            >
              Email
            </label>
            <Input
              id='register-email'
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
              htmlFor='register-phone'
              className='text-sm-bold text-foreground tracking-tight'
            >
              Number Phone
            </label>
            <Input
              id='register-phone'
              type='tel'
              placeholder='Enter your phone number'
              {...register('phone')}
              aria-invalid={errors.phone ? 'true' : 'false'}
              className='border-border bg-background'
            />
            {errors.phone && (
              <p className='text-sm-medium text-destructive'>
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='register-password'
              className='text-sm-bold text-foreground tracking-tight'
            >
              Password
            </label>
            <div className='relative'>
              <Input
                id='register-password'
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

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='register-confirmPassword'
              className='text-sm-bold text-foreground tracking-tight'
            >
              Confirm Password
            </label>
            <div className='relative'>
              <Input
                id='register-confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                {...register('confirmPassword')}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                className='border-border bg-background pe-10'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500 hover:text-white'
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                <span className='sr-only'>
                  {showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-sm-medium text-destructive'>
                {errors.confirmPassword.message}
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
                <Loader2 className='me-2 h-4 w-4 animate-spin' /> Creating
                account...
              </>
            ) : (
              'Submit'
            )}
          </Button>

          <div className='text-md-medium flex items-center gap-1'>
            <span className='text-foreground'>Already have an account?</span>
            <Link
              href={ROUTES.LOGIN}
              className='text-primary hover:text-primary-200 font-bold'
            >
              Login
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
