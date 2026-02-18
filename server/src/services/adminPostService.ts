import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';

export const adminPostService = {
  async getPosts(page: number, limit: number, search?: string, status?: string) {
    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        users!posts_user_id_fkey(id, nickname, email, avatar_url)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new AppError(500, '게시글 목록을 가져오는데 실패했습니다');
    }

    return { data: data || [], total: count || 0, page, limit };
  },

  async updatePostStatus(id: string, status: 'active' | 'hidden' | 'deleted') {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(500, '게시글 상태 변경에 실패했습니다');
    }

    return data;
  },
};
