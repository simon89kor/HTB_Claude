import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { signAdminToken } from '../middleware/adminAuth';
import { AdminUser } from '../types/admin';

export const adminAuthService = {
  async login(email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    // Verify password using pgcrypto crypt() via RPC
    const { data: isValid, error: verifyError } = await supabaseAdmin
      .rpc('verify_admin_password', {
        input_email: email,
        input_password: password,
      });

    if (verifyError || !isValid) {
      throw new AppError(401, '이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // Fetch admin user data
    const { data: adminData, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .eq('email', email)
      .single();

    if (fetchError || !adminData) {
      throw new AppError(401, '이메일 또는 비밀번호가 올바르지 않습니다');
    }

    if (!adminData.is_active) {
      throw new AppError(403, '비활성화된 관리자 계정입니다');
    }

    // Update last login time
    await supabaseAdmin
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminData.id);

    const token = signAdminToken({
      id: adminData.id,
      email: adminData.email,
      role: adminData.role,
    });

    const admin: AdminUser = {
      ...adminData,
      last_login_at: new Date().toISOString(),
    };

    return { token, admin };
  },

  async getProfile(adminId: string): Promise<AdminUser> {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .eq('id', adminId)
      .single();

    if (error || !data) {
      throw new AppError(404, '관리자를 찾을 수 없습니다');
    }

    return data as AdminUser;
  },

  async changePassword(adminId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Get admin email for password verification
    const { data: admin, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('email')
      .eq('id', adminId)
      .single();

    if (fetchError || !admin) {
      throw new AppError(404, '관리자를 찾을 수 없습니다');
    }

    // Verify old password
    const { data: isValid, error: verifyError } = await supabaseAdmin
      .rpc('verify_admin_password', {
        input_email: admin.email,
        input_password: oldPassword,
      });

    if (verifyError || !isValid) {
      throw new AppError(400, '현재 비밀번호가 올바르지 않습니다');
    }

    // Update password
    const { error: updateError } = await supabaseAdmin
      .rpc('update_admin_password', {
        admin_id: adminId,
        new_password: newPassword,
      });

    if (updateError) {
      throw new AppError(500, '비밀번호 변경에 실패했습니다');
    }
  },
};
