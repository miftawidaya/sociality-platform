export interface Author {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  saved?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: PaginationMeta;
  };
}

export interface ActionResponse {
  success: boolean;
  message: string;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  author: Author;
  status?: 'sending' | 'error';
  error?: string;
}

export interface PostDetailResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    pagination: PaginationMeta;
  };
}
