import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';

export const adminPurchaseService = {
  async getPurchases(page: number, limit: number, search?: string, status?: string) {
    let query = supabaseAdmin
      .from('purchases')
      .select(`
        *,
        users!purchases_user_id_fkey(id, nickname, email),
        routines!purchases_routine_id_fkey(id, title, category)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      // Search by user nickname or routine title via related tables is complex
      // We'll filter on the purchase fields or do a broader approach
      query = query.or(`users.nickname.ilike.%${search}%,routines.title.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new AppError(500, '구매 목록을 가져오는데 실패했습니다');
    }

    return { data: data || [], total: count || 0, page, limit };
  },

  async refundPurchase(id: string) {
    // Check current status
    const { data: purchase, error: fetchError } = await supabaseAdmin
      .from('purchases')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError || !purchase) {
      throw new AppError(404, '구매 내역을 찾을 수 없습니다');
    }

    if (purchase.status === 'refunded') {
      throw new AppError(400, '이미 환불된 구매입니다');
    }

    const { data, error } = await supabaseAdmin
      .from('purchases')
      .update({ status: 'refunded' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(500, '환불 처리에 실패했습니다');
    }

    return data;
  },
};
