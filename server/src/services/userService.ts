import { supabaseAdmin } from '../config/supabase';
import { User, UpdateUserDto } from '../types/user';

export const userService = {
  async getProfile(userId: string): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, dto: UpdateUserDto): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(dto)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAccount(userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    // Also delete from Supabase Auth
    await supabaseAdmin.auth.admin.deleteUser(userId);
  },

  async updatePreferences(userId: string, preferences: string[]): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ preferences })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserById(userId: string): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, nickname, avatar_url, bio, created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as User;
  },

  async followUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) throw error;
  },

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  },

  async getFollowers(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('follows')
      .select('follower_id, users!follows_follower_id_fkey(id, nickname, avatar_url)')
      .eq('following_id', userId);

    if (error) throw error;
    return data;
  },

  async getFollowing(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('follows')
      .select('following_id, users!follows_following_id_fkey(id, nickname, avatar_url)')
      .eq('follower_id', userId);

    if (error) throw error;
    return data;
  },
};
