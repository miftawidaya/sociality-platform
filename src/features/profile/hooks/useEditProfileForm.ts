import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileSchema } from '../validations/profile.schema';
import type { UserProfileInfo } from '../types/profile.types';

export function useEditProfileForm(user: UserProfileInfo) {
  return useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio || '',
      email: user.email || '',
      phone: user.phone || '',
    },
  });
}
