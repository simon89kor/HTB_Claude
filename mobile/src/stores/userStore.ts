import { create } from 'zustand';
import { CategoryKey, PeriodKey } from '@/src/types';

// ─── Types ──────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  bio: string | null;
  gender: 'male' | 'female' | null;
  birthDate: string | null;
  preferences: CategoryKey[];
  followerCount: number;
  followingCount: number;
  postCount: number;
}

export interface MyRoutine {
  id: string;
  title: string;
  category: CategoryKey;
  providerName: string;
  period: PeriodKey;
  progress: number; // 0-100
  dday: number;
  status: 'active' | 'completed';
  startedAt: string;
  endsAt: string;
}

export interface FollowUser {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  bio: string | null;
  isFollowing: boolean;
}

interface NotificationSettings {
  routine: boolean;
  community: boolean;
  marketing: boolean;
}

interface UserStoreState {
  profile: UserProfile | null;
  myRoutines: MyRoutine[];
  followers: FollowUser[];
  following: FollowUser[];
  notificationSettings: NotificationSettings;
  isLoading: boolean;
}

interface UserStoreActions {
  loadProfile: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleFollow: (userId: string) => void;
  setNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
}

// ─── Demo Data ──────────────────────────────────────────

const DEMO_PROFILE: UserProfile = {
  id: 'user-1',
  email: 'jiwoo@htb.com',
  nickname: '지우',
  avatarUrl: null,
  bio: '루틴으로 성장하는 중 🌱',
  gender: 'female',
  birthDate: '1998-03-15',
  preferences: ['exercise', 'selfdev'],
  followerCount: 12,
  followingCount: 28,
  postCount: 5,
};

const DEMO_ROUTINES: MyRoutine[] = [
  {
    id: 'routine-1',
    title: '아침 기상 루틴',
    category: 'selfdev',
    providerName: '김민준 코치',
    period: '4week',
    progress: 68,
    dday: 5,
    status: 'active',
    startedAt: '2026-01-25T00:00:00Z',
    endsAt: '2026-02-22T00:00:00Z',
  },
  {
    id: 'routine-2',
    title: '홈트레이닝 30일 챌린지',
    category: 'exercise',
    providerName: '박서연 트레이너',
    period: '4week',
    progress: 45,
    dday: 12,
    status: 'active',
    startedAt: '2026-02-01T00:00:00Z',
    endsAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'routine-3',
    title: '매일 영어 독해 습관',
    category: 'study',
    providerName: '이하은 선생님',
    period: '100days',
    progress: 32,
    dday: 68,
    status: 'active',
    startedAt: '2026-01-10T00:00:00Z',
    endsAt: '2026-04-20T00:00:00Z',
  },
  {
    id: 'routine-4',
    title: '클린 식단 관리',
    category: 'diet',
    providerName: '최영희 영양사',
    period: '1week',
    progress: 80,
    dday: 2,
    status: 'active',
    startedAt: '2026-02-12T00:00:00Z',
    endsAt: '2026-02-19T00:00:00Z',
  },
  {
    id: 'routine-5',
    title: '토익 900점 달성 루틴',
    category: 'cert',
    providerName: '정승환 강사',
    period: '4week',
    progress: 100,
    dday: 0,
    status: 'completed',
    startedAt: '2025-12-01T00:00:00Z',
    endsAt: '2025-12-29T00:00:00Z',
  },
  {
    id: 'routine-6',
    title: '독서 습관 만들기',
    category: 'selfdev',
    providerName: '김민준 코치',
    period: '4week',
    progress: 100,
    dday: 0,
    status: 'completed',
    startedAt: '2025-11-15T00:00:00Z',
    endsAt: '2025-12-13T00:00:00Z',
  },
];

const DEMO_FOLLOWERS: FollowUser[] = [
  { id: 'f-1', nickname: '서연', avatarUrl: null, bio: '매일 운동하는 사람', isFollowing: true },
  { id: 'f-2', nickname: '민준', avatarUrl: null, bio: '자기계발 중독자', isFollowing: false },
  { id: 'f-3', nickname: '하은', avatarUrl: null, bio: '건강한 식단 실천 중', isFollowing: true },
  { id: 'f-4', nickname: '도윤', avatarUrl: null, bio: '토익 공부 화이팅', isFollowing: false },
  { id: 'f-5', nickname: '수아', avatarUrl: null, bio: null, isFollowing: true },
  { id: 'f-6', nickname: '예준', avatarUrl: null, bio: '아침형 인간 도전', isFollowing: false },
  { id: 'f-7', nickname: '소율', avatarUrl: null, bio: '다이어트 루틴 실천 중', isFollowing: true },
  { id: 'f-8', nickname: '시우', avatarUrl: null, bio: null, isFollowing: false },
  { id: 'f-9', nickname: '지아', avatarUrl: null, bio: '공부 루틴 진행 중', isFollowing: true },
  { id: 'f-10', nickname: '건우', avatarUrl: null, bio: '운동 초보', isFollowing: false },
  { id: 'f-11', nickname: '하린', avatarUrl: null, bio: '매일 성장하자', isFollowing: true },
  { id: 'f-12', nickname: '은서', avatarUrl: null, bio: '루틴 마스터 목표', isFollowing: false },
];

const DEMO_FOLLOWING: FollowUser[] = [
  { id: 'g-1', nickname: '민서', avatarUrl: null, bio: '피트니스 인플루언서', isFollowing: true },
  { id: 'g-2', nickname: '지호', avatarUrl: null, bio: '자기계발 전문가', isFollowing: true },
  { id: 'g-3', nickname: '윤서', avatarUrl: null, bio: '영양사', isFollowing: true },
  { id: 'g-4', nickname: '서준', avatarUrl: null, bio: '영어 강사', isFollowing: true },
  { id: 'g-5', nickname: '하윤', avatarUrl: null, bio: '독서 모임장', isFollowing: true },
  { id: 'g-6', nickname: '준서', avatarUrl: null, bio: '아침 루틴 전문가', isFollowing: true },
  { id: 'g-7', nickname: '예은', avatarUrl: null, bio: '요가 강사', isFollowing: true },
  { id: 'g-8', nickname: '도현', avatarUrl: null, bio: null, isFollowing: true },
  { id: 'g-9', nickname: '채원', avatarUrl: null, bio: '다이어트 코치', isFollowing: true },
  { id: 'g-10', nickname: '지환', avatarUrl: null, bio: '공인중개사 합격생', isFollowing: true },
  { id: 'g-11', nickname: '수빈', avatarUrl: null, bio: '공부법 공유', isFollowing: true },
  { id: 'g-12', nickname: '이준', avatarUrl: null, bio: null, isFollowing: true },
  { id: 'g-13', nickname: '다은', avatarUrl: null, bio: '식단 관리 중', isFollowing: true },
  { id: 'g-14', nickname: '태윤', avatarUrl: null, bio: '운동 루틴 공유', isFollowing: true },
  { id: 'g-15', nickname: '나윤', avatarUrl: null, bio: '습관 디자이너', isFollowing: true },
  { id: 'g-16', nickname: '시연', avatarUrl: null, bio: null, isFollowing: true },
  { id: 'g-17', nickname: '현우', avatarUrl: null, bio: '매일 달리는 사람', isFollowing: true },
  { id: 'g-18', nickname: '아린', avatarUrl: null, bio: '미라클 모닝 실천', isFollowing: true },
  { id: 'g-19', nickname: '유준', avatarUrl: null, bio: '자격증 도전', isFollowing: true },
  { id: 'g-20', nickname: '소은', avatarUrl: null, bio: null, isFollowing: true },
  { id: 'g-21', nickname: '재민', avatarUrl: null, bio: '건강한 삶 추구', isFollowing: true },
  { id: 'g-22', nickname: '하율', avatarUrl: null, bio: '루틴 입문자', isFollowing: true },
  { id: 'g-23', nickname: '은호', avatarUrl: null, bio: null, isFollowing: true },
  { id: 'g-24', nickname: '수현', avatarUrl: null, bio: '프로 계획러', isFollowing: true },
  { id: 'g-25', nickname: '주원', avatarUrl: null, bio: '매일 조금씩', isFollowing: true },
  { id: 'g-26', nickname: '연우', avatarUrl: null, bio: null, isFollowing: true },
  { id: 'g-27', nickname: '지윤', avatarUrl: null, bio: '독서광', isFollowing: true },
  { id: 'g-28', nickname: '시현', avatarUrl: null, bio: '운동 루틴 3개월차', isFollowing: true },
];

// ─── Store ──────────────────────────────────────────────

export const useUserStore = create<UserStoreState & UserStoreActions>()((set, get) => ({
  // State
  profile: null,
  myRoutines: [],
  followers: [],
  following: [],
  notificationSettings: {
    routine: true,
    community: true,
    marketing: false,
  },
  isLoading: false,

  // Actions
  loadProfile: () => {
    set({ isLoading: true });
    // Simulate loading
    setTimeout(() => {
      set({
        profile: DEMO_PROFILE,
        myRoutines: DEMO_ROUTINES,
        followers: DEMO_FOLLOWERS,
        following: DEMO_FOLLOWING,
        isLoading: false,
      });
    }, 300);
  },

  updateProfile: (data: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) return;
    set({ profile: { ...profile, ...data } });
  },

  toggleFollow: (userId: string) => {
    const { followers, following, profile } = get();
    let followerDelta = 0;
    let followingDelta = 0;

    const updatedFollowers = followers.map((f) => {
      if (f.id === userId) {
        followerDelta = f.isFollowing ? 0 : 0; // follower count doesn't change when we follow back
        return { ...f, isFollowing: !f.isFollowing };
      }
      return f;
    });

    const updatedFollowing = following.map((f) => {
      if (f.id === userId) {
        followingDelta = f.isFollowing ? -1 : 1;
        return { ...f, isFollowing: !f.isFollowing };
      }
      return f;
    });

    set({
      followers: updatedFollowers,
      following: updatedFollowing,
      profile: profile
        ? { ...profile, followingCount: profile.followingCount + followingDelta }
        : null,
    });
  },

  setNotificationSetting: (key: keyof NotificationSettings, value: boolean) => {
    set((state) => ({
      notificationSettings: { ...state.notificationSettings, [key]: value },
    }));
  },
}));
