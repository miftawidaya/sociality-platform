import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export const createPostSchema = z.object({
  caption: z
    .string()
    .trim()
    .max(500, 'Caption must be under 500 characters')
    .optional(),
  image: z
    .any()
    .refine((file) => file instanceof File, 'Image is required')
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max image size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.has(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
