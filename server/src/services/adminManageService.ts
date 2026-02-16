import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { AdminUser, CreateAdminDto, UpdateAdminDto } from '../types/admin';

export const adminManageService = {
  async getAdmins(): Promise<AdminUser[]> {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(500, '관리자 목록을 가져오는데 실패했습니다');
    }

    return (data || []) as AdminUser[];
  },

  async createAdmin(dto: CreateAdminDto): Promise<AdminUser> {
    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existing) {
      throw new AppError(409, '이미 등록된 이메일입니다');
    }

    // Create admin using RPC (handles password hashing)
    const { data: newId, error: createError } = await supabaseAdmin
      .rpc('create_admin_user', {
        input_email: dto.email,
        input_password: dto.password,
        input_name: dto.name,
        input_role: dto.role,
      });

    if (createError || !newId) {
      throw new AppError(500, '관리자 생성에 실패했습니다');
    }

    // Fetch the created admin
    const { data: admin, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .eq('id', newId)
      .single();

    if (fetchError || !admin) {
      throw new AppError(500, '생성된 관리자 정보를 가져오는데 실패했습니다');
    }

    return admin as AdminUser;
  },

  async updateAdmin(id: string, dto: UpdateAdminDto): Promise<AdminUser> {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.is_active !== undefined) updateData.is_active = dto.is_active;

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .single();

    if (error) {
      throw new AppError(500, '관리자 정보 수정에 실패했습니다');
    }

    return data as AdminUser;
  },

  async deleteAdmin(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
      throw new AppError(400, '자기 자신은 삭제할 수 없습니다');
    }

    const { error } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError(500, '관리자 삭제에 실패했습니다');
    }
  },
};
