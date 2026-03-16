export interface UserProfileInfo {
  id: number;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatarUrl: string | null;
  createdAt?: string;
  isFollowedByMe?: boolean;
}

export interface UserStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}

export interface ProfileResponse {
  profile: UserProfileInfo;
  stats: UserStats;
}
