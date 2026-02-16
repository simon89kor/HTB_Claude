import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { CreateRoutineDto, UpdateRoutineDto, RoutineItemDto } from '../types/admin';

export const adminRoutineService = {
  async getRoutines(
    page: number,
    limit: number,
    search?: string,
    category?: string,
    isPublished?: boolean
  ) {
    let query = supabaseAdmin
      .from('routines')
      .select('*, users!routines_provider_id_fkey(id, nickname, email, avatar_url)', { count: 'exact' });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (isPublished !== undefined) {
      query = query.eq('is_published', isPublished);
    }

    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new AppError(500, '루틴 목록을 가져오는데 실패했습니다');
    }

    return { data: data || [], total: count || 0, page, limit };
  },

  async getRoutineById(id: string) {
    const { data: routine, error: routineError } = await supabaseAdmin
      .from('routines')
      .select('*, users!routines_provider_id_fkey(id, nickname, email, avatar_url)')
      .eq('id', id)
      .single();

    if (routineError || !routine) {
      throw new AppError(404, '루틴을 찾을 수 없습니다');
    }

    // Get routine items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from('routine_items')
      .select('*')
      .eq('routine_id', id)
      .order('day_number')
      .order('sort_order');

    if (itemsError) {
      throw new AppError(500, '루틴 항목을 가져오는데 실패했습니다');
    }

    // Get purchase stats
    const { count: purchaseCount } = await supabaseAdmin
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('routine_id', id)
      .eq('status', 'completed');

    return {
      ...routine,
      items: items || [],
      stats: {
        purchaseCount: purchaseCount || 0,
      },
    };
  },

  async createRoutine(dto: CreateRoutineDto, adminId: string) {
    // Create routine
    const { data: routine, error: routineError } = await supabaseAdmin
      .from('routines')
      .insert({
        provider_id: dto.provider_id,
        title: dto.title,
        description: dto.description || null,
        category: dto.category,
        image_url: dto.image_url || null,
        price_1week: dto.price_1week ?? 1400,
        price_4week: dto.price_4week ?? 5600,
        price_100days: dto.price_100days ?? 20000,
        is_published: dto.is_published ?? false,
        created_by_admin: adminId,
      })
      .select()
      .single();

    if (routineError || !routine) {
      throw new AppError(500, '루틴 생성에 실패했습니다');
    }

    // Create routine items if provided
    if (dto.items && dto.items.length > 0) {
      const itemsToInsert = dto.items.map((item) => ({
        routine_id: routine.id,
        day_number: item.day_number,
        title: item.title,
        description: item.description || null,
        sort_order: item.sort_order ?? 0,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('routine_items')
        .insert(itemsToInsert);

      if (itemsError) {
        // Rollback: delete the routine
        await supabaseAdmin.from('routines').delete().eq('id', routine.id);
        throw new AppError(500, '루틴 항목 생성에 실패했습니다');
      }
    }

    return routine;
  },

  async updateRoutine(id: string, dto: UpdateRoutineDto) {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.image_url !== undefined) updateData.image_url = dto.image_url;
    if (dto.price_1week !== undefined) updateData.price_1week = dto.price_1week;
    if (dto.price_4week !== undefined) updateData.price_4week = dto.price_4week;
    if (dto.price_100days !== undefined) updateData.price_100days = dto.price_100days;
    if (dto.is_published !== undefined) updateData.is_published = dto.is_published;

    const { data, error } = await supabaseAdmin
      .from('routines')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(500, '루틴 수정에 실패했습니다');
    }

    return data;
  },

  async updateRoutineItems(routineId: string, items: RoutineItemDto[]) {
    // Verify routine exists
    const { error: checkError } = await supabaseAdmin
      .from('routines')
      .select('id')
      .eq('id', routineId)
      .single();

    if (checkError) {
      throw new AppError(404, '루틴을 찾을 수 없습니다');
    }

    // Delete existing items
    const { error: deleteError } = await supabaseAdmin
      .from('routine_items')
      .delete()
      .eq('routine_id', routineId);

    if (deleteError) {
      throw new AppError(500, '기존 루틴 항목 삭제에 실패했습니다');
    }

    // Insert new items
    if (items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        routine_id: routineId,
        day_number: item.day_number,
        title: item.title,
        description: item.description || null,
        sort_order: item.sort_order ?? 0,
      }));

      const { error: insertError } = await supabaseAdmin
        .from('routine_items')
        .insert(itemsToInsert);

      if (insertError) {
        throw new AppError(500, '루틴 항목 생성에 실패했습니다');
      }
    }

    // Update routine updated_at
    await supabaseAdmin
      .from('routines')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', routineId);

    // Return updated items
    const { data, error } = await supabaseAdmin
      .from('routine_items')
      .select('*')
      .eq('routine_id', routineId)
      .order('day_number')
      .order('sort_order');

    if (error) {
      throw new AppError(500, '루틴 항목을 가져오는데 실패했습니다');
    }

    return data || [];
  },

  async togglePublish(id: string) {
    // Get current state
    const { data: routine, error: fetchError } = await supabaseAdmin
      .from('routines')
      .select('is_published')
      .eq('id', id)
      .single();

    if (fetchError || !routine) {
      throw new AppError(404, '루틴을 찾을 수 없습니다');
    }

    // Toggle
    const { data, error } = await supabaseAdmin
      .from('routines')
      .update({
        is_published: !routine.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(500, '루틴 공개 상태 변경에 실패했습니다');
    }

    return data;
  },

  async deleteRoutine(id: string) {
    // Delete routine items first (cascade should handle this, but be explicit)
    await supabaseAdmin
      .from('routine_items')
      .delete()
      .eq('routine_id', id);

    const { error } = await supabaseAdmin
      .from('routines')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError(500, '루틴 삭제에 실패했습니다');
    }
  },
};
