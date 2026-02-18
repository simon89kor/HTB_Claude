// User
export type Gender = 'male' | 'female' | 'other';
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

// Routine
export type PeriodKey = '1week' | '4week' | '100days';
export type PurchaseStatus = 'pending' | 'completed' | 'refunded';

export interface Routine {
  id: string;
  providerId: string;
  provider?: User;
  title: string;
  description: string;
  category: CategoryKey;
  imageUrl: string | null;
  price1week: number;
  price4week: number;
  price100days: number;
  isPublished: boolean;
  purchaseCount: number;
  ratingAvg: number;
  createdAt: string;
}

export interface RoutineItem {
  id: string;
  routineId: string;
  dayNumber: number;
  title: string;
  description: string;
  sortOrder: number;
}

// Purchase
export interface Purchase {
  id: string;
  userId: string;
  routineId: string;
  routine?: Routine;
  period: PeriodKey;
  amount: number;
  status: PurchaseStatus;
  paymentMethod: string;
  startedAt: string;
  endsAt: string;
  createdAt: string;
}

// Todo
export interface UserTodo {
  id: string;
  userId: string;
  purchaseId: string;
  routineItemId: string;
  routineItem?: RoutineItem;
  scheduledDate: string;
  completedAt: string | null;
  isSkipped: boolean;
}

// Post (Community)
export type PostCategory = 'review' | 'daily' | 'question' | 'tip';

export interface Post {
  id: string;
  userId: string;
  user?: User;
  routineId: string | null;
  title: string;
  content: string;
  imageUrls: string[];
  hashtags: string[];
  category: PostCategory;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

// Follow
export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
