export interface Routine {
  id: string;
  provider_id: string;
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
  created_at: string;
}

export interface RoutineItem {
  id: string;
  routine_id: string;
  day_number: number;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface RoutineQueryParams {
  category?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}
