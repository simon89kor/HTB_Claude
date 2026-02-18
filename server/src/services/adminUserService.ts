import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';

export const adminUserService = {
  async getUsers(page: number, limit: number, search?: string, status?: string) {
    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`nickname.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new AppError(500, '사용자 목록을 가져오는데 실패했습니다');
    }

    return { data: data || [], total: count || 0, page, limit };
  },

  async getUserById(id: string) {
    // Get user profile
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (userError || !user) {
      throw new AppError(404, '사용자를 찾을 수 없습니다');
    }

    // Get purchase history
    const { data: purchases, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .select(`
        id, amount, period, status, created_at,
        routines!purchases_routine_id_fkey(id, title, category)
      `)
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (purchaseError) {
      throw new AppError(500, '구매 내역을 가져오는데 실패했습니다');
    }

    // Get stats
    const { count: purchaseCount } = await supabaseAdmin
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id)
      .eq('status', 'completed');

    const { count: postCount } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    const { count: followerCount } = await supabaseAdmin
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', id);

    const { count: followingCount } = await supabaseAdmin
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', id);

    return {
      ...user,
      purchases: purchases || [],
      stats: {
        purchaseCount: purchaseCount || 0,
        postCount: postCount || 0,
        followerCount: followerCount || 0,
        followingCount: followingCount || 0,
      },
    };
  },

  async updateUserStatus(id: string, status: 'active' | 'suspended' | 'banned') {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(500, '사용자 상태 변경에 실패했습니다');
    }

    return data;
  },

  async searchUsers(search: string, limit: number = 20) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, nickname, avatar_url')
      .or(`nickname.ilike.%${search}%,email.ilike.%${search}%`)
      .limit(limit);

    if (error) {
      throw new AppError(500, '사용자 검색에 실패했습니다');
    }

    return data || [];
  },
};
