'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionHeader } from '@/components/layouts/header/SectionHeader';
import { PageHeader } from '@/components/layouts/header/PageHeader';
import { Button } from '@/components/ui/button';
import { UploadCloud02 } from '@untitledui/icons';
import {
  createPostSchema,
  type CreatePostFormValues,
} from '@/features/post/validations/post.schema';
import { useCreatePost } from '@/features/post/hooks/useCreatePost';

export default function AddPostPage() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const createPostMutation = useCreatePost();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      caption: '',
    },
  });

  const selectedImage = watch('image');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue('image', undefined, { shouldValidate: true });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: CreatePostFormValues) => {
    const formData = new FormData();
    if (data.caption) {
      formData.append('caption', data.caption);
    }
    if (data.image) {
      formData.append('image', data.image);
    }
    router.push('/');
    createPostMutation.mutate(formData);
  };

  return (
    <div className='bg-background md:pb-11xl flex min-h-screen flex-col items-center pb-24'>
      {/* Mobile Header */}
      <PageHeader title='Add Post' backTo='/' className='md:hidden' />

      <main className='mt-6 flex w-full flex-col px-4 md:mt-10 md:w-113 md:px-0'>
        {/* Desktop Header Logic (Hidden on Mobile) */}
        <SectionHeader title='Add Post' className='hidden md:flex' />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-6 flex flex-col gap-6 md:mt-10'
        >
          {/* Photo Section */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm-bold text-foreground leading-7'>
              Photo
            </label>

            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              accept='image/jpeg, image/jpg, image/png, image/webp'
              onChange={handleImageChange}
            />

            {imagePreview ? (
              <div className='bg-card border-border relative flex w-full flex-col overflow-hidden rounded-xl border p-2'>
                <div className='relative aspect-square w-full md:aspect-4/3'>
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='size-full rounded-lg object-cover'
                  />
                </div>
                <div className='mt-2 flex w-full justify-center gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleRemoveImage}
                    className='text-destructive border-border hover:bg-destructive/10 hover:text-destructive'
                  >
                    Delete Image
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`bg-card flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-6 py-4 transition-colors hover:bg-neutral-900/50 ${
                  errors.image ? 'border-destructive' : 'border-border'
                }`}
              >
                <div className='border-border flex size-10 items-center justify-center rounded-lg border'>
                  <UploadCloud02 className='text-foreground size-5' />
                </div>
                <div className='mt-2 flex gap-1'>
                  <span className='text-sm-bold text-primary'>
                    Click to upload
                  </span>
                  <span className='text-sm-medium text-muted-foreground'>
                    or drag and drop
                  </span>
                </div>
                <p className='text-sm-medium text-muted-foreground'>
                  PNG or JPG (max. 5mb)
                </p>
              </div>
            )}

            {errors.image && (
              <p className='text-xs-regular text-destructive mt-1'>
                {errors.image.message as string}
              </p>
            )}
          </div>

          {/* Caption Section */}
          <div className='flex flex-col gap-0.5'>
            <label
              htmlFor='caption'
              className='text-sm-bold text-foreground leading-7'
            >
              Caption
            </label>
            <div
              className={`border-input bg-card flex w-full items-start rounded-xl border px-4 py-2 ${
                errors.caption ? 'border-destructive' : ''
              }`}
            >
              <textarea
                id='caption'
                {...register('caption')}
                rows={3}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
                placeholder='Create your caption'
                className='text-md-regular text-foreground w-full resize-none overflow-hidden bg-transparent leading-7.5 outline-none placeholder:text-neutral-600'
              />
            </div>
            {errors.caption && (
              <p className='text-xs-regular text-destructive'>
                {errors.caption.message as string}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={!selectedImage}
            className='bg-primary text-primary-foreground md:text-md-bold text-sm-bold mt-2 h-10 w-full rounded-full hover:opacity-90 md:h-12 md:leading-7.5'
          >
            Share
          </Button>
        </form>
      </main>
    </div>
  );
}
