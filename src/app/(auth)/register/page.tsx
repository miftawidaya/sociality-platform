'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/lib/api/client';
import { ROUTES } from '@/config/routes';
import { API_ENDPOINTS } from '@/config/api';
import { AuthLogo } from '@/components/auth/AuthLogo';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);

      const { user, token } = response.data;

      Cookies.set('token', token, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      });

      dispatch(setCredentials(user));

      router.push(ROUTES.FEED);
      router.refresh();
    } catch (error: any) {
      setServerError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLogo />

      <h1 className='text-display-xs text-foreground text-center font-bold'>
        Register
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-6'
      >
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='name'
              className='text-text-sm text-foreground font-bold tracking-tight'
            >
              Full Name
            </label>
            <Input
              id='name'
              placeholder='John Doe'
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
              className='border-border bg-background'
            />
            {errors.name && (
              <p className='text-text-sm text-destructive font-medium tracking-tight'>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='username'
              className='text-text-sm text-foreground font-bold tracking-tight'
            >
              Username
            </label>
            <Input
              id='username'
              placeholder='johndoe'
              {...register('username')}
              aria-invalid={errors.username ? 'true' : 'false'}
              className='border-border bg-background'
            />
            {errors.username && (
              <p className='text-text-sm text-destructive font-medium tracking-tight'>
                {errors.username.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='email'
              className='text-text-sm text-foreground font-bold tracking-tight'
            >
              Email
            </label>
            <Input
              id='email'
              type='email'
              placeholder='john@example.com'
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              className='border-border bg-background'
            />
            {errors.email && (
              <p className='text-text-sm text-destructive font-medium tracking-tight'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='phone'
              className='text-text-sm text-foreground font-bold tracking-tight'
            >
              Number Phone
            </label>
            <Input
              id='phone'
              type='tel'
              placeholder='081234567890'
              {...register('phone')}
              aria-invalid={errors.phone ? 'true' : 'false'}
              className='border-border bg-background'
            />
            {errors.phone && (
              <p className='text-text-sm text-destructive font-medium tracking-tight'>
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='password'
              className='text-text-sm text-foreground font-bold tracking-tight'
            >
              Password
            </label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
                className='border-border bg-background pe-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute end-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className='text-text-sm text-destructive font-medium tracking-tight'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='confirmPassword'
              className='text-text-sm text-foreground font-bold tracking-tight'
            >
              Confirm Password
            </label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...register('confirmPassword')}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                className='border-border bg-background pe-10'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute end-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white'
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-text-sm text-destructive font-medium tracking-tight'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {serverError && (
          <div className='bg-destructive/10 text-destructive text-text-sm rounded-lg p-3 text-center font-medium'>
            {serverError}
          </div>
        )}

        <div className='flex flex-col items-center gap-4'>
          <Button
            type='submit'
            disabled={isLoading}
            className='text-text-md h-12 w-full rounded-full font-bold'
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

          <div className='text-text-md flex items-center gap-1 font-medium tracking-tight'>
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
