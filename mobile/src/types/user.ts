export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type CategoryKey = 'exercise' | 'diet' | 'selfdev' | 'cert' | 'study';

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  bio: string | null;
  gender: Gender | null;
  birthDate: string | null;
  preferences: CategoryKey[];
  createdAt: string;
}

export interface UserProfile extends User {
  followerCount: number;
  followingCount: number;
  routineCount: number;
  isFollowing?: boolean;
}
