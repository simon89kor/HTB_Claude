import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser } from '../types';

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
