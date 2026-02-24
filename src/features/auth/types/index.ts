export type { LoginInput, RegisterInput } from '../validations/auth';

/** User object returned from auth API responses */
export interface AuthUser {
  readonly id: number;
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly phone?: string;
  readonly avatarUrl: string | null;
}

/** Shape of the auth API response data */
export interface AuthResponse {
  readonly user: AuthUser;
  readonly token: string;
}
