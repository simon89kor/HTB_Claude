export type AdminRole = 'super_admin' | 'sales';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  gender: string | null;
  birth_date: string | null;
  preferences: string[];
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
}

export interface Routine {
  id: string;
  provider_id: string;
  provider_name?: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  price_1week: number;
  price_4week: number;
  price_100days: number;
  is_published: boolean;
  purchase_count: number;
  rating_avg: number;
  created_by_admin: string | null;
  created_at: string;
}

export interface RoutineItem {
  id?: string;
  routine_id?: string;
  day_number: number;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface Purchase {
  id: string;
  user_id: string;
  user_nickname?: string;
  routine_id: string;
  routine_title?: string;
  period: '1week' | '4week' | '100days';
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  payment_method: string | null;
  started_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  user_nickname?: string;
  routine_id: string | null;
  title: string;
  content: string | null;
  image_urls: string[];
  hashtags: string[];
  category: string | null;
  like_count: number;
  comment_count: number;
  status: 'active' | 'hidden' | 'deleted';
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalRoutines: number;
  totalPurchases: number;
  totalRevenue: number;
  recentUsers: number;
  recentPurchases: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryInfo {
  key: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'exercise', label: '운동루틴', emoji: '💪' },
  { key: 'diet', label: '식단관리', emoji: '🥗' },
  { key: 'selfdev', label: '자기계발', emoji: '🎓' },
  { key: 'cert', label: '자격증', emoji: '📝' },
  { key: 'study', label: '학업', emoji: '📚' },
];
