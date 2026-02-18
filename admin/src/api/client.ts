const DEMO_MODE = !import.meta.env.VITE_API_URL;
const BASE_URL = '/api/admin';

// ── Demo mock data ──────────────────────────────────────────────────
const DEMO_USERS = Array.from({ length: 12 }, (_, i) => ({
  id: `user-${i + 1}`,
  email: `user${i + 1}@example.com`,
  nickname: ['김민수', '이지은', '박서준', '최유리', '정하늘', '강다현', '윤재호', '임수진', '한도윤', '송예린', '조민혁', '배수아'][i],
  avatar_url: null,
  bio: i % 3 === 0 ? '루틴으로 삶이 바뀌었어요!' : null,
  gender: i % 2 === 0 ? 'male' : 'female',
  birth_date: `199${i % 10}-0${(i % 9) + 1}-15`,
  preferences: [['exercise', 'diet'], ['selfdev', 'cert'], ['study', 'exercise'], ['diet', 'selfdev']][i % 4],
  status: i === 10 ? 'suspended' : 'active' as const,
  created_at: new Date(2026, 0, i + 1).toISOString(),
}));

const DEMO_ROUTINES = Array.from({ length: 8 }, (_, i) => ({
  id: `routine-${i + 1}`,
  provider_id: `user-${i + 1}`,
  provider_name: DEMO_USERS[i]?.nickname ?? `Provider ${i + 1}`,
  title: ['30일 전신 운동 루틴', '간헐적 단식 식단 플랜', '매일 영어 30분', '정보처리기사 합격 루틴', '새벽 5시 기상 챌린지', '요가 & 명상 루틴', '토익 900점 달성', '주 5회 홈트레이닝'][i],
  description: '체계적으로 설계된 루틴입니다.',
  category: ['exercise', 'diet', 'selfdev', 'cert', 'selfdev', 'exercise', 'study', 'exercise'][i],
  image_url: null,
  price_1week: [9900, 12900, 7900, 14900, 5900, 9900, 11900, 8900][i],
  price_4week: [29900, 39900, 24900, 44900, 19900, 29900, 34900, 26900][i],
  price_100days: [79900, 99900, 59900, 119900, 49900, 79900, 89900, 69900][i],
  is_published: i !== 7,
  purchase_count: [156, 89, 234, 67, 312, 45, 178, 0][i],
  rating_avg: [4.5, 4.2, 4.8, 4.1, 4.7, 4.3, 4.6, 0][i],
  created_by_admin: i < 3 ? 'demo-super-admin-001' : null,
  created_at: new Date(2026, 0, i + 1).toISOString(),
}));

const DEMO_PURCHASES = Array.from({ length: 15 }, (_, i) => ({
  id: `purchase-${i + 1}`,
  user_id: DEMO_USERS[i % 12].id,
  user_nickname: DEMO_USERS[i % 12].nickname,
  routine_id: DEMO_ROUTINES[i % 8].id,
  routine_title: DEMO_ROUTINES[i % 8].title,
  period: (['1week', '4week', '100days'] as const)[i % 3],
  amount: [9900, 39900, 79900, 12900, 24900, 99900, 14900, 29900, 59900, 5900, 44900, 119900, 9900, 34900, 49900][i],
  status: (['completed', 'completed', 'pending', 'completed', 'refunded'] as const)[i % 5],
  payment_method: ['카드', '카카오페이', '네이버페이'][i % 3],
  started_at: new Date(2026, 1, i + 1).toISOString(),
  ends_at: new Date(2026, 2, i + 1).toISOString(),
  created_at: new Date(2026, 1, i + 1).toISOString(),
}));

const DEMO_POSTS = Array.from({ length: 10 }, (_, i) => ({
  id: `post-${i + 1}`,
  user_id: DEMO_USERS[i % 12].id,
  user_nickname: DEMO_USERS[i % 12].nickname,
  routine_id: DEMO_ROUTINES[i % 8].id,
  title: ['오늘 운동 완료!', '식단 1주차 후기', '영어 공부 꿀팁', '자격증 합격했어요', '새벽 기상 3일차', '요가 루틴 추천', '토익 점수 올랐어요', '홈트 후기', '루틴 변경 질문', '다이어트 성공기'][i],
  content: '루틴대로 했더니 정말 효과가 있네요. 추천합니다!',
  image_urls: i % 3 === 0 ? ['https://placehold.co/400x300'] : [],
  hashtags: [['운동', '루틴'], ['식단', '다이어트'], ['영어', '자기계발']][i % 3],
  category: ['exercise', 'diet', 'selfdev', 'cert', 'selfdev'][i % 5],
  like_count: Math.floor(Math.random() * 50),
  comment_count: Math.floor(Math.random() * 20),
  status: i === 9 ? 'hidden' : 'active' as const,
  created_at: new Date(2026, 1, 18 - i).toISOString(),
}));

const DEMO_ADMINS = [
  {
    id: 'demo-super-admin-001',
    email: 'admin@htb.com',
    name: 'Super Admin',
    role: 'super_admin' as const,
    is_active: true,
    last_login_at: new Date().toISOString(),
    created_at: '2026-01-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-sales-001',
    email: 'sales@htb.com',
    name: '영업팀 김철수',
    role: 'sales' as const,
    is_active: true,
    last_login_at: '2026-02-15T09:00:00Z',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-02-15T09:00:00Z',
  },
];

function paginate<T>(data: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return {
    data: data.slice(start, start + limit),
    total: data.length,
    page,
    limit,
  };
}

function demoResponse(path: string, params?: Record<string, string | number | undefined>): unknown {
  const page = Number(params?.page) || 1;
  const limit = Number(params?.limit) || 20;

  if (path === '/dashboard/stats') {
    return {
      totalUsers: DEMO_USERS.length,
      totalRoutines: DEMO_ROUTINES.length,
      totalPurchases: DEMO_PURCHASES.length,
      totalRevenue: DEMO_PURCHASES.reduce((s, p) => s + p.amount, 0),
      recentUsers: 5,
      recentPurchases: 8,
    };
  }
  if (path === '/users') return paginate(DEMO_USERS, page, limit);
  if (path.startsWith('/users/')) {
    const id = path.split('/')[2];
    const user = DEMO_USERS.find((u) => u.id === id);
    if (!user) return DEMO_USERS[0];
    const purchases = DEMO_PURCHASES.filter((p) => p.user_id === id);
    return { ...user, purchases, total_spent: purchases.reduce((s, p) => s + p.amount, 0) };
  }
  if (path === '/routines') return paginate(DEMO_ROUTINES, page, limit);
  if (path.startsWith('/routines/')) {
    const id = path.split('/')[2];
    const routine = DEMO_ROUTINES.find((r) => r.id === id) ?? DEMO_ROUTINES[0];
    return {
      ...routine,
      items: [
        { id: 'item-1', routine_id: routine.id, day_number: 1, title: '스트레칭 10분', description: '전신 스트레칭으로 시작', sort_order: 0 },
        { id: 'item-2', routine_id: routine.id, day_number: 1, title: '유산소 30분', description: '가볍게 달리기', sort_order: 1 },
        { id: 'item-3', routine_id: routine.id, day_number: 2, title: '근력 운동', description: '상체 위주', sort_order: 0 },
        { id: 'item-4', routine_id: routine.id, day_number: 2, title: '플랭크 3세트', description: '1분씩', sort_order: 1 },
        { id: 'item-5', routine_id: routine.id, day_number: 3, title: '하체 운동', description: '스쿼트 + 런지', sort_order: 0 },
      ],
    };
  }
  if (path === '/purchases') return paginate(DEMO_PURCHASES, page, limit);
  if (path === '/posts') return paginate(DEMO_POSTS, page, limit);
  if (path === '/admins') return DEMO_ADMINS;
  if (path === '/auth/me') return DEMO_ADMINS[0];

  return { data: [], total: 0, page: 1, limit: 20 };
}

// ── Real API client ─────────────────────────────────────────────────
function getToken(): string | null {
  try {
    const stored = localStorage.getItem('htb-admin-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.token ?? null;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  // Demo mode: return mock data
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 300)); // simulate network
    if (method === 'GET') {
      return demoResponse(path, params) as T;
    }
    // For POST/PUT/DELETE, return success
    return { success: true } as T;
  }

  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    localStorage.removeItem('htb-admin-auth');
    window.location.href = '/login';
    throw new Error('인증이 만료되었습니다.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `요청 실패 (${response.status})`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    return request<T>('GET', path, undefined, params);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, body);
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PUT', path, body);
  },

  delete<T>(path: string): Promise<T> {
    return request<T>('DELETE', path);
  },
};
