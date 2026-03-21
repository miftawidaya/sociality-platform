import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/post-api';
import { POST_KEYS } from './useFeedQuery';
import { PROFILE_KEYS } from '@/features/profile/queries/profile.keys';
import { toast } from 'sonner';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => postApi.createPost(formData),
    onMutate: async (formData) => {
      // Cancel queries to avoid overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: POST_KEYS.feed });
      await queryClient.cancelQueries({ queryKey: PROFILE_KEYS.me() });

      // Snapshot previous
      const previousFeed = queryClient.getQueriesData({
        queryKey: POST_KEYS.feed,
      });

      // Fetch real user profile from cache for precise author data
      const myProfileData = queryClient.getQueryData<any>(PROFILE_KEYS.me());
      const authorProfile = myProfileData?.profile || {
        id: Date.now(),
        name: 'Me',
        username: 'me',
        avatarUrl: null,
      };

      // Construct a fake optimistic post
      const optimisticPost = {
        id: Math.random() * -1000, // Temp ID
        caption: formData.get('caption') as string,
        imageUrl: URL.createObjectURL(formData.get('image') as File),
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        likedByMe: false,
        saved: false,
        author: {
          id: authorProfile.id,
          name: authorProfile.name,
          username: authorProfile.username,
          avatarUrl: authorProfile.avatarUrl,
        },
      };

      queryClient.setQueriesData({ queryKey: POST_KEYS.feed }, (old: any) => {
        if (!old?.pages || old.pages.length === 0) return old;

        const newPages = [...old.pages];
        const firstPage = { ...newPages[0] };

        // Ensure posts array exists
        firstPage.posts = firstPage.posts
          ? [optimisticPost, ...firstPage.posts]
          : [optimisticPost];
        newPages[0] = firstPage;

        return {
          ...old,
          pages: newPages,
        };
      });

      return { previousFeed };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeed) {
        context.previousFeed.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to create post');
    },
    onSuccess: () => {
      toast.success('Success Post');
    },
    onSettled: () => {
      // Invalidate to fetch real data
      queryClient.invalidateQueries({ queryKey: POST_KEYS.feed });
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me() });
    },
  });
}
