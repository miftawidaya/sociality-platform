import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { postApi } from '../api/post-api';
import { POST_KEYS } from './useFeedQuery';
import type { Comment, Post, Author } from '../types';

export const POST_DETAIL_KEYS = {
  all: ['posts'] as const,
  detail: (id: number) => [...POST_DETAIL_KEYS.all, 'detail', id] as const,
  comments: (id: number) =>
    [...POST_DETAIL_KEYS.all, 'comments', id] as const,
};

export function usePostDetailQuery(postId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: POST_DETAIL_KEYS.detail(postId),
    queryFn: async ({ signal }) => {
      const response = await postApi.getPostById(postId, signal);
      const savedIds = queryClient.getQueryData<Set<number>>([...POST_KEYS.feed, 'savedIds']);
      if (response?.data && savedIds) {
        response.data.saved = savedIds.has(postId) || response.data.saved || false;
      }
      return response;
    },
    enabled: postId > 0,
    initialData: () => {
      // 1. Try to find the post inside the timeline (feed/explore) cache
      const feedData = queryClient.getQueriesData({ queryKey: POST_KEYS.feed });
      
      for (const [_key, data] of feedData) {
        if (!data) continue;
        const typedData = data as { pages?: Array<{ posts?: Post[] }> };
        for (const page of typedData.pages || []) {
          const post = page.posts?.find((p) => p.id === postId);
          if (post) {
            // Return standard PostDetailResponse format expected by component
            return {
              success: true,
              message: 'Found in cache',
              data: post,
            };
          }
        }
      }

      // 2. Return undefined if not found so it fetches natively
      return undefined;
    },
  });
}

export function useCommentsQuery(postId: number, limit = 10) {
  return useInfiniteQuery({
    queryKey: [...POST_DETAIL_KEYS.comments(postId), { limit }],
    queryFn: ({ pageParam, signal }) =>
      postApi.getComments(postId, pageParam, limit, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage: {
      data?: { pagination?: { page: number; totalPages: number } };
    }) => {
      const pagination = lastPage?.data?.pagination;
      if (
        pagination === undefined ||
        pagination === null ||
        pagination.page >= pagination.totalPages
      ) {
        return undefined;
      }
      return pagination.page + 1;
    },
    enabled: postId > 0,
  });
}

export function useCreateCommentMutation(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { content: string; tempId?: number; author?: Author }) =>
      postApi.createComment(postId, args.content),
    onMutate: async ({ content, tempId, author }) => {
      await queryClient.cancelQueries({
        queryKey: POST_DETAIL_KEYS.comments(postId),
      });

      const previousComments = queryClient.getQueryData(
        POST_DETAIL_KEYS.comments(postId)
      );

      const optimisticComment: Comment = {
        id: tempId ?? Math.random(),
        text: content,
        createdAt: new Date().toISOString(),
        author: author ?? {
          id: -1,
          username: 'Me',
          name: 'Me',
          avatarUrl: null,
        },
        status: 'sending',
      };

      queryClient.setQueriesData(
        { queryKey: POST_DETAIL_KEYS.comments(postId) },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any, index: number) => {
              if (index === 0) {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    comments: [optimisticComment, ...(page.data?.comments ?? [])],
                  },
                };
              }
              return page;
            }),
          };
        }
      );

      return { previousComments, tempId };
    },
    onError: (err, variables, context) => {
      if (context?.tempId) {
        queryClient.setQueriesData(
          { queryKey: POST_DETAIL_KEYS.comments(postId) },
          (old: any) => 
            updateCommentInPages(old, context.tempId!, { 
              status: 'error', 
              error: 'Failed to send' 
            })
        );
      }
    },
    onSuccess: (response, variables, context) => {
      if (context?.tempId && response.data) {
        queryClient.setQueriesData(
          { queryKey: POST_DETAIL_KEYS.comments(postId) },
          (old: any) => 
            updateCommentInPages(old, context.tempId!, { 
              ...response.data, 
              status: undefined 
            })
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: POST_DETAIL_KEYS.detail(postId),
      });
    },
  });
}

export function useDeleteCommentMutation(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => postApi.deleteComment(commentId),
    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({
        queryKey: POST_DETAIL_KEYS.comments(postId),
      });

      const previousData = queryClient.getQueriesData({
        queryKey: POST_DETAIL_KEYS.comments(postId),
      });

      queryClient.setQueriesData(
        { queryKey: POST_DETAIL_KEYS.comments(postId) },
        (old: unknown) => removeCommentFromPages(old, commentId)
      );

      return { previousData };
    },
    onError: (
      _err: unknown,
      _commentId: number,
      context: { previousData: Array<[unknown, unknown]> } | undefined
    ) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: POST_DETAIL_KEYS.comments(postId),
      });
      queryClient.invalidateQueries({
        queryKey: POST_DETAIL_KEYS.detail(postId),
      });
    },
  });
}

// Helpers to reduce function nesting depth for SonarQube compliance
type CommentPage = {
  data?: { comments?: Comment[] };
};

function removeCommentFromPages(oldData: unknown, commentId: number) {
  if (!oldData || typeof oldData !== 'object') return oldData;
  const data = oldData as { pages: CommentPage[] };

  return {
    ...data,
    pages: data.pages.map((page) => removeCommentFromPage(page, commentId)),
  };
}

function removeCommentFromPage(page: CommentPage, commentId: number) {
  return {
    ...page,
    data: {
      ...page.data,
      comments: (page.data?.comments ?? []).filter(
        (c: Comment) => c.id !== commentId
      ),
    },
  };
}

function updateCommentInPages(
  oldData: any,
  tempId: number,
  updates: Partial<Comment>
) {
  if (!oldData?.pages) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => ({
      ...page,
      data: {
        ...page.data,
        comments: (page.data?.comments ?? []).map((c: Comment) =>
          c.id === tempId ? { ...c, ...updates } : c
        ),
      },
    })),
  };
}
