import { supabase, supabaseAdmin } from '../config/supabase';
import { CreateUserDto } from '../types/user';

export const authService = {
  async signUp(email: string, password: string, userData: CreateUserDto) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('회원가입에 실패했습니다');

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        nickname: userData.nickname,
        preferences: userData.preferences || [],
      });

    if (profileError) throw profileError;

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut(token: string) {
    // Set the session for this specific token
    const { error } = await supabase.auth.admin.signOut(token);
    if (error) {
      // Fallback: just invalidate on client side
      await supabase.auth.signOut();
    }
  },

  async refreshToken(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) throw error;
    return data;
  },

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
};
