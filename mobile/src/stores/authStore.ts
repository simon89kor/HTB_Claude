import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import { User, CategoryKey } from '@/src/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  preferences: CategoryKey[];
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  socialLogin: (provider: 'kakao' | 'apple' | 'google') => Promise<void>;
  logout: () => void;
  setPreferences: (preferences: CategoryKey[]) => void;
  setOnboarded: () => void;
  clearError: () => void;
}

const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'user@htb.com',
  nickname: '데모유저',
  avatarUrl: null,
  bio: null,
  gender: null,
  birthDate: null,
  preferences: [],
  createdAt: '2026-01-01T00:00:00Z',
};

const DEMO_TOKEN = 'demo-token-abc123';

// Simple in-memory storage for persistence
const memoryMap: Record<string, string> = {};
const memoryStorage = {
  getItem: (key: string): string | null => {
    return memoryMap[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    memoryMap[key] = value;
  },
  removeItem: (key: string): void => {
    delete memoryMap[key];
  },
};

// Use localStorage on web, in-memory storage on native
const getStorage = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    return createJSONStorage(() => window.localStorage);
  }
  return createJSONStorage(() => memoryStorage);
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isOnboarded: false,
      preferences: [],
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Demo mode: simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          const user: User = {
            ...DEMO_USER,
            email,
          };
          set({
            user,
            token: DEMO_TOKEN,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ error: '로그인에 실패했습니다.', isLoading: false });
        }
      },

      signup: async (email: string, _password: string, nickname: string) => {
        set({ isLoading: true, error: null });
        try {
          // Demo mode: simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          const user: User = {
            ...DEMO_USER,
            id: `demo-user-${Date.now()}`,
            email,
            nickname,
            createdAt: new Date().toISOString(),
          };
          set({
            user,
            token: DEMO_TOKEN,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ error: '회원가입에 실패했습니다.', isLoading: false });
        }
      },

      socialLogin: async (provider: 'kakao' | 'apple' | 'google') => {
        set({ isLoading: true, error: null });
        try {
          // Demo mode: simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          const providerNames = { kakao: '카카오', apple: 'Apple', google: 'Google' };
          const user: User = {
            ...DEMO_USER,
            id: `demo-${provider}-${Date.now()}`,
            nickname: `${providerNames[provider]}유저`,
          };
          set({
            user,
            token: DEMO_TOKEN,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ error: '소셜 로그인에 실패했습니다.', isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isOnboarded: false,
          preferences: [],
          isLoading: false,
          error: null,
        });
      },

      setPreferences: (preferences: CategoryKey[]) => {
        set((state) => ({
          preferences,
          user: state.user
            ? { ...state.user, preferences }
            : null,
        }));
      },

      setOnboarded: () => {
        set({ isOnboarded: true });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'htb-auth-storage',
      storage: getStorage(),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        preferences: state.preferences,
      }),
    }
  )
);
