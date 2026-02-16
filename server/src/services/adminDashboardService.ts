import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { DashboardStats } from '../types/admin';

export const adminDashboardService = {
  async getStats(): Promise<DashboardStats> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoIso = sevenDaysAgo.toISOString();

    // Run all queries in parallel
    const [
      usersResult,
      routinesResult,
      purchasesResult,
      revenueResult,
      recentUsersResult,
      recentPurchasesResult,
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('routines').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('purchases').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabaseAdmin.from('purchases').select('amount').eq('status', 'completed'),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgoIso),
      supabaseAdmin.from('purchases').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgoIso),
    ]);

    // Calculate total revenue
    let totalRevenue = 0;
    if (revenueResult.data) {
      totalRevenue = revenueResult.data.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);
    }

    return {
      totalUsers: usersResult.count || 0,
      totalRoutines: routinesResult.count || 0,
      totalPurchases: purchasesResult.count || 0,
      totalRevenue,
      recentUsers: recentUsersResult.count || 0,
      recentPurchases: recentPurchasesResult.count || 0,
    };
  },

  async getRecentActivity(): Promise<unknown[]> {
    const { data, error } = await supabaseAdmin
      .from('purchases')
      .select(`
        id, amount, period, status, created_at,
        users!purchases_user_id_fkey(id, nickname, email),
        routines!purchases_routine_id_fkey(id, title, category)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw new AppError(500, '최근 활동을 가져오는데 실패했습니다');
    }

    return data || [];
  },
};
