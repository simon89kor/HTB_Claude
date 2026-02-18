import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser } from '../types';

// Demo mode: Supabase 연결 없이 로컬에서 UI 확인용
const DEMO_MODE = !import.meta.env.VITE_API_URL;

const DEMO_ADMIN: AdminUser = {
  id: 'demo-super-admin-001',
  email: 'admin@htb.com',
  name: 'Super Admin',
  role: 'super_admin',
  is_active: true,
  last_login_at: new Date().toISOString(),
  created_at: '2026-01-01T00:00:00Z',
  updated_at: new Date().toISOString(),
};

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        // Demo mode: 로컬 검증
        if (DEMO_MODE) {
          await new Promise((r) => setTimeout(r, 500)); // 로딩 효과
          if (email === 'admin@htb.com' && password === 'admin1234') {
            set({
              admin: DEMO_ADMIN,
              token: 'demo-token-' + Date.now(),
              isLoading: false,
              error: null,
            });
            return;
          }
          set({
            isLoading: false,
            error: '이메일 또는 비밀번호가 올바르지 않습니다. (데모: admin@htb.com / admin1234)',
          });
          throw new Error('Invalid credentials');
        }

        // Production mode: 백엔드 API 호출
        try {
          const response = await fetch('/api/admin/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '로그인에 실패했습니다.');
          }

          const data = await response.json();
          set({
            admin: data.admin,
            token: data.token,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : '로그인에 실패했습니다.',
          });
          throw err;
        }
      },

      logout: () => {
        set({ admin: null, token: null, error: null });
        localStorage.removeItem('htb-admin-auth');
        window.location.href = '/login';
      },

      loadFromStorage: () => {
        // persist middleware handles this automatically
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'htb-admin-auth',
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
      }),
    }
  )
);
