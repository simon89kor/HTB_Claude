export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'sales';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface CreateAdminDto {
  email: string;
  password: string;
  name: string;
  role: 'super_admin' | 'sales';
}

export interface UpdateAdminDto {
  name?: string;
  role?: 'super_admin' | 'sales';
  is_active?: boolean;
}

export interface CreateRoutineDto {
  provider_id: string;
  title: string;
  description?: string;
  category: string;
  image_url?: string;
  price_1week?: number;
  price_4week?: number;
  price_100days?: number;
  is_published?: boolean;
  items?: RoutineItemDto[];
}

export interface RoutineItemDto {
  day_number: number;
  title: string;
  description?: string;
  sort_order?: number;
}

export interface UpdateRoutineDto {
  title?: string;
  description?: string;
  category?: string;
  image_url?: string;
  price_1week?: number;
  price_4week?: number;
  price_100days?: number;
  is_published?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalRoutines: number;
  totalPurchases: number;
  totalRevenue: number;
  recentUsers: number;
  recentPurchases: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}
