export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  gender: string | null;
  birth_date: string | null;
  preferences: string[];
  created_at: string;
}

export interface CreateUserDto {
  email: string;
  nickname: string;
  preferences?: string[];
}

export interface UpdateUserDto {
  nickname?: string;
  avatar_url?: string;
  bio?: string;
  gender?: string;
  birth_date?: string;
  preferences?: string[];
}
