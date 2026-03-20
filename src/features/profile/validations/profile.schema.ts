import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20).regex(/^\w+$/, 'Username can only contain letters, numbers and underscores'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^(08|\+62|62)\d{8,13}/, 'Invalid phone number').optional().or(z.literal('')),
  bio: z.string().max(160, 'Bio must be at most 160 characters').optional().or(z.literal('')),
  avatar: z.any().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
