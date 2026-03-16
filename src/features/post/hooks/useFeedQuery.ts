import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { postApi } from '../api/post-api';

export const POST_KEYS = {
  feed: ['feed'] as const,
};

type TimelinePageParam = {
  source: 'feed' | 'explore';
  page: number;
};

// --- New Hook to Fetch All Saved Post IDs (Workaround) ---
export function useSavedPostsIdsQuery(isAuthenticated = false) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...POST_KEYS.feed, 'savedIds'],
    queryFn: async () => {
      // Fetch the first 50 saved posts to build a lookup Set.
      // 50 is the maximum limit allowed by the backend API.
      // This forms our 'best effort' sync cache for recent saves since
      // the backend feed timeline payload lacks the `saved` property.
      const data = await postApi.getSavedPosts(1, 50);
      const ids = new Set<number>();
      // Defensively check for both 'posts' and 'items' as the backend 
      // sometimes varies the field name between feed and bookmarks.
      const list = data?.posts || data?.items || [];
      for (const item of list) {
        const postId = item.id || item.post?.id; 
        if (postId) ids.add(postId);
      }

      // Forcefully update the existing Feed cache immediately to sync the UI
      queryClient.setQueriesData({ queryKey: POST_KEYS.feed }, (oldData: any) => 
        applySavedStatusToPages(oldData, ids)
      );

      return ids;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTimelineQuery(limit = 10, isAuthenticated = false) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: [...POST_KEYS.feed, { limit, isAuthenticated }],
    queryFn: async ({ pageParam }) => {
      const { source, page } = pageParam;

      // Get the locally cached or prefetched saved IDs
      const savedIds = queryClient.getQueryData<Set<number>>([...POST_KEYS.feed, 'savedIds']) || new Set<number>();

      const attachSavedStatus = (data: any) => {
        if (!data?.posts) return data;
        return {
          ...data,
          posts: data.posts.map((p: any) => ({
            ...p,
            saved: savedIds.has(p.id) || p.saved || false,
          })),
        };
      };

      if (source === 'feed') {
        const data = await postApi.getFeed(page, limit);
        if (page === 1 && (data.posts || []).length === 0) {
          const exploreData = await postApi.getExplorePosts(1, limit);
          return attachSavedStatus({ ...exploreData, source: 'explore' as const });
        }
        return attachSavedStatus({ ...data, source });
      } else {
        const data = await postApi.getExplorePosts(page, limit);
        return attachSavedStatus({ ...data, source });
      }
    },
    initialPageParam: {
      source: isAuthenticated ? 'feed' : 'explore',
      page: 1,
    } as TimelinePageParam,
    getNextPageParam: (lastPage) => {
      // If we are currently fetching from feed
      if (lastPage.source === 'feed') {
        // If feed has items remaining
        if (lastPage.pagination.page < lastPage.pagination.totalPages) {
          return {
            source: 'feed',
            page: lastPage.pagination.page + 1,
          } as TimelinePageParam;
        }
        // Exhausted Feed or Feed empty. Switch to Explore starting at page 1
        return { source: 'explore', page: 1 } as TimelinePageParam;
      }

      // If we are currently fetching from explore
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return {
          source: 'explore',
          page: lastPage.pagination.page + 1,
        } as TimelinePageParam;
      }

      // No more explore pages either
      return undefined;
    },
    // Prevent duplicate items when merging pages
    select: (data) => {
      const seenIds = new Set<number>();

      return {
        ...data,
        pages: data.pages.map((page: any) => ({
          ...page,
          posts: (page?.posts || []).filter((post: any) => {
            if (seenIds.has(post.id)) return false;
            seenIds.add(post.id);
            return true;
          }),
        })),
      };
    },
  });
}

// Optimistic updates for Likes
export function useLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      action,
    }: {
      postId: number;
      action: 'like' | 'unlike';
    }) => {
      if (action === 'like') return postApi.likePost(postId);
      return postApi.unlikePost(postId);
    },
    onMutate: async ({ postId, action }) => {
      const detailKey = ['posts', 'detail', postId];

      // Cancel queries to avoid overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: POST_KEYS.feed });
      await queryClient.cancelQueries({ queryKey: detailKey });

      // Snapshot all previous queries matching the key
      const previousFeedQueries = queryClient.getQueriesData({
        queryKey: POST_KEYS.feed,
      });
      const previousDetailQuery = queryClient.getQueryData(detailKey);

      // Optimistically update all queries matching the 'feed' key
      queryClient.setQueriesData(
        { queryKey: POST_KEYS.feed },
        (old: any) => updateLikeInPages(old, postId, action)
      );

      // Optimistically update individual post detail
      queryClient.setQueryData(detailKey, (old: any) => {
        if (!old?.data) return old;
        const isLiking = action === 'like';
        return {
          ...old,
          data: {
            ...old.data,
            likedByMe: isLiking,
            likeCount: isLiking
              ? old.data.likeCount + 1
              : Math.max(0, old.data.likeCount - 1),
          },
        };
      });

      return { previousFeedQueries, previousDetailQuery, detailKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeedQueries) {
        context.previousFeedQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetailQuery && context?.detailKey) {
        queryClient.setQueryData(context.detailKey, context.previousDetailQuery);
      }
    },
    onSettled: () => {
      // Opt to refetch or just keep optimistic state
    },
  });
}

// Optimistic updates for Saves
export function useSaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      action,
    }: {
      postId: number;
      action: 'save' | 'unsave';
    }) => {
      console.log('Mutation Triggered:', action, 'for post:', postId);
      if (action === 'save') return postApi.savePost(postId);
      return postApi.unsavePost(postId);
    },
    onMutate: async ({ postId, action }) => {
      const detailKey = ['posts', 'detail', postId];
      const savedIdsKey = [...POST_KEYS.feed, 'savedIds'];

      await queryClient.cancelQueries({ queryKey: POST_KEYS.feed });
      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: savedIdsKey });

      const previousFeedQueries = queryClient.getQueriesData({
        queryKey: POST_KEYS.feed,
      });
      const previousDetailQuery = queryClient.getQueryData(detailKey);
      const previousSavedIds = queryClient.getQueryData<Set<number>>(savedIdsKey);

      // Optimistically update Feed queries
      queryClient.setQueriesData(
        { queryKey: POST_KEYS.feed },
        (old: any) => updateSaveInPages(old, postId, action)
      );

      // Optimistically update Saved IDs Set
      if (previousSavedIds) {
        const nextSavedIds = new Set(previousSavedIds);
        if (action === 'save') nextSavedIds.add(postId);
        else nextSavedIds.delete(postId);
        queryClient.setQueryData(savedIdsKey, nextSavedIds);
      }

      queryClient.setQueryData(detailKey, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            saved: action === 'save',
          },
        };
      });

      return { previousFeedQueries, previousDetailQuery, previousSavedIds, detailKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFeedQueries) {
        context.previousFeedQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetailQuery && context?.detailKey) {
        queryClient.setQueryData(context.detailKey, context.previousDetailQuery);
      }
      const savedIdsKey = [...POST_KEYS.feed, 'savedIds'];
      if (context?.previousSavedIds) {
        queryClient.setQueryData(savedIdsKey, context.previousSavedIds);
      }
    },
  });
}

/**
 * Top-level helpers to reduce function nesting depth for SonarQube compliance.
 */
function updateLikeInPages(old: any, postId: number, action: 'like' | 'unlike') {
  if (!old?.pages) return old;
  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      posts: updatePostInList(page.posts, postId, (post) => {
        const isLiking = action === 'like';
        return {
          ...post,
          likedByMe: isLiking,
          likeCount: isLiking
            ? post.likeCount + 1
            : Math.max(0, post.likeCount - 1),
        };
      }),
    })),
  };
}

function updateSaveInPages(old: any, postId: number, action: 'save' | 'unsave') {
  if (!old?.pages) return old;
  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      posts: updatePostInList(page.posts, postId, (post) => ({
        ...post,
        saved: action === 'save',
      })),
    })),
  };
}

function updatePostInList(
  posts: any[],
  targetId: number,
  updateFn: (post: any) => any
) {
  return (posts || []).map((post: any) => {
    if (post.id === targetId) {
      return updateFn(post);
    }
    return post;
  });
}

function applySavedStatusToPages(oldData: any, savedIds: Set<number>) {
  if (!oldData?.pages) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => ({
      ...page,
      posts: (page.posts || []).map((post: any) => ({
        ...post,
        saved: savedIds.has(post.id) || post.saved || false,
      })),
    })),
  };
}

