import { supabaseAdmin } from '../config/supabase';
import { RoutineQueryParams } from '../types/routine';

export const routineService = {
  async getRoutines(params: RoutineQueryParams) {
    let query = supabaseAdmin
      .from('routines')
      .select('*, users!routines_provider_id_fkey(id, nickname, avatar_url)', { count: 'exact' })
      .eq('is_published', true);

    if (params.category) {
      query = query.eq('category', params.category);
    }

    if (params.search) {
      query = query.ilike('title', `%${params.search}%`);
    }

    switch (params.sort) {
      case 'popular':
        query = query.order('purchase_count', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating_avg', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count || 0, page, limit };
  },

  async getTopRoutines() {
    const { data, error } = await supabaseAdmin
      .from('routines')
      .select('*, users!routines_provider_id_fkey(id, nickname, avatar_url)')
      .eq('is_published', true)
      .order('purchase_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  },

  async getRoutineById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('routines')
      .select('*, users!routines_provider_id_fkey(id, nickname, avatar_url)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getRoutineItems(routineId: string) {
    const { data, error } = await supabaseAdmin
      .from('routine_items')
      .select('*')
      .eq('routine_id', routineId)
      .order('day_number')
      .order('sort_order');

    if (error) throw error;
    return data;
  },
};
