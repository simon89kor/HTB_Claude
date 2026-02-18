import { CategoryKey } from './user';

export type PeriodKey = '1week' | '4week' | '100days';

export interface Routine {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatarUrl: string | null;
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
  description: string | null;
  sortOrder: number;
}

export interface RoutineDetail extends Routine {
  items: RoutineItem[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  rating: number;
  content: string;
  createdAt: string;
}
