import { create } from 'zustand';
import { Routine, RoutineItem, CategoryKey } from '@/src/types';

// Mock provider data
const mockProviders: Record<string, { id: string; nickname: string }> = {
  'provider-1': { id: 'provider-1', nickname: '김민수' },
  'provider-2': { id: 'provider-2', nickname: '이지은' },
  'provider-3': { id: 'provider-3', nickname: '박서준' },
  'provider-4': { id: 'provider-4', nickname: '최유리' },
  'provider-5': { id: 'provider-5', nickname: '정하늘' },
  'provider-6': { id: 'provider-6', nickname: '강다현' },
  'provider-7': { id: 'provider-7', nickname: '윤재호' },
  'provider-8': { id: 'provider-8', nickname: '임수진' },
  'provider-9': { id: 'provider-9', nickname: '한도윤' },
  'provider-10': { id: 'provider-10', nickname: '송예린' },
  'provider-11': { id: 'provider-11', nickname: '오세준' },
  'provider-12': { id: 'provider-12', nickname: '나은서' },
};

// Category colors for placeholder images
export const categoryColors: Record<string, string> = {
  exercise: '#E8F5E9',
  diet: '#FFF3E0',
  selfdev: '#E3F2FD',
  cert: '#F3E5F5',
  study: '#FFF9C4',
};

export const categoryAccentColors: Record<string, string> = {
  exercise: '#66BB6A',
  diet: '#FFA726',
  selfdev: '#42A5F5',
  cert: '#AB47BC',
  study: '#FFEE58',
};

// Mock routines data
const MOCK_ROUTINES: Routine[] = [
  {
    id: 'routine-1',
    providerId: 'provider-1',
    provider: {
      id: 'provider-1',
      email: 'kim@htb.com',
      nickname: '김민수',
      avatarUrl: null,
      bio: '헬스 트레이너 10년차',
      gender: 'male',
      birthDate: null,
      preferences: ['exercise'],
      createdAt: '2025-06-01T00:00:00Z',
    },
    title: '30일 전신 운동 루틴',
    description: '운동 초보자도 따라할 수 있는 체계적인 30일 전신 운동 프로그램입니다. 매일 30분씩 투자하면 눈에 띄는 변화를 경험할 수 있습니다.',
    category: 'exercise',
    imageUrl: null,
    price1week: 9900,
    price4week: 29900,
    price100days: 79900,
    isPublished: true,
    purchaseCount: 287,
    ratingAvg: 4.8,
    createdAt: '2025-08-15T00:00:00Z',
  },
  {
    id: 'routine-2',
    providerId: 'provider-2',
    provider: {
      id: 'provider-2',
      email: 'lee@htb.com',
      nickname: '이지은',
      avatarUrl: null,
      bio: '영양사 & 다이어트 코치',
      gender: 'female',
      birthDate: null,
      preferences: ['diet'],
      createdAt: '2025-05-01T00:00:00Z',
    },
    title: '간헐적 단식 식단 플랜',
    description: '16:8 간헐적 단식을 기반으로 한 건강한 식단 관리 플랜입니다. 무리하지 않으면서 체중 관리와 건강을 동시에 챙길 수 있습니다.',
    category: 'diet',
    imageUrl: null,
    price1week: 12900,
    price4week: 39900,
    price100days: 99900,
    isPublished: true,
    purchaseCount: 203,
    ratingAvg: 4.6,
    createdAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'routine-3',
    providerId: 'provider-3',
    provider: {
      id: 'provider-3',
      email: 'park@htb.com',
      nickname: '박서준',
      avatarUrl: null,
      bio: '영어 교육 전문가',
      gender: 'male',
      birthDate: null,
      preferences: ['selfdev'],
      createdAt: '2025-04-01T00:00:00Z',
    },
    title: '매일 영어 30분',
    description: '하루 30분, 매일 꾸준히 영어 실력을 키우는 루틴입니다. 리스닝, 스피킹, 리딩을 골고루 연습합니다.',
    category: 'selfdev',
    imageUrl: null,
    price1week: 7900,
    price4week: 24900,
    price100days: 59900,
    isPublished: true,
    purchaseCount: 156,
    ratingAvg: 4.5,
    createdAt: '2025-10-01T00:00:00Z',
  },
  {
    id: 'routine-4',
    providerId: 'provider-4',
    provider: {
      id: 'provider-4',
      email: 'choi@htb.com',
      nickname: '최유리',
      avatarUrl: null,
      bio: 'IT 자격증 전문 강사',
      gender: 'female',
      birthDate: null,
      preferences: ['cert'],
      createdAt: '2025-03-01T00:00:00Z',
    },
    title: '정보처리기사 합격 루틴',
    description: '정보처리기사 필기+실기를 한 번에 준비하는 체계적인 학습 루틴입니다. 하루 2시간 투자로 합격을 목표로 합니다.',
    category: 'cert',
    imageUrl: null,
    price1week: 14900,
    price4week: 44900,
    price100days: 119900,
    isPublished: true,
    purchaseCount: 98,
    ratingAvg: 4.7,
    createdAt: '2025-07-15T00:00:00Z',
  },
  {
    id: 'routine-5',
    providerId: 'provider-5',
    provider: {
      id: 'provider-5',
      email: 'jung@htb.com',
      nickname: '정하늘',
      avatarUrl: null,
      bio: '라이프스타일 코치',
      gender: 'female',
      birthDate: null,
      preferences: ['selfdev'],
      createdAt: '2025-06-15T00:00:00Z',
    },
    title: '새벽 5시 기상 챌린지',
    description: '새벽 기상 습관을 만들어 하루를 더 효율적으로 보내세요. 21일간의 단계별 기상 시간 조절 플랜을 제공합니다.',
    category: 'selfdev',
    imageUrl: null,
    price1week: 5900,
    price4week: 17900,
    price100days: 39900,
    isPublished: true,
    purchaseCount: 312,
    ratingAvg: 4.3,
    createdAt: '2025-11-01T00:00:00Z',
  },
  {
    id: 'routine-6',
    providerId: 'provider-6',
    provider: {
      id: 'provider-6',
      email: 'kang@htb.com',
      nickname: '강다현',
      avatarUrl: null,
      bio: '요가 강사 & 명상 가이드',
      gender: 'female',
      birthDate: null,
      preferences: ['exercise'],
      createdAt: '2025-05-15T00:00:00Z',
    },
    title: '요가 & 명상 루틴',
    description: '아침 요가와 저녁 명상으로 몸과 마음의 균형을 찾아보세요. 초보자도 쉽게 따라할 수 있는 동작으로 구성되어 있습니다.',
    category: 'exercise',
    imageUrl: null,
    price1week: 9900,
    price4week: 29900,
    price100days: 69900,
    isPublished: true,
    purchaseCount: 178,
    ratingAvg: 4.9,
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'routine-7',
    providerId: 'provider-7',
    provider: {
      id: 'provider-7',
      email: 'yoon@htb.com',
      nickname: '윤재호',
      avatarUrl: null,
      bio: '토익 만점 강사',
      gender: 'male',
      birthDate: null,
      preferences: ['study'],
      createdAt: '2025-04-15T00:00:00Z',
    },
    title: '토익 900점 달성 루틴',
    description: '토익 900점을 목표로 한 체계적인 학습 루틴입니다. LC/RC 파트별 매일 학습 분량을 정해 꾸준히 공부할 수 있습니다.',
    category: 'study',
    imageUrl: null,
    price1week: 11900,
    price4week: 34900,
    price100days: 89900,
    isPublished: true,
    purchaseCount: 134,
    ratingAvg: 4.4,
    createdAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'routine-8',
    providerId: 'provider-8',
    provider: {
      id: 'provider-8',
      email: 'lim@htb.com',
      nickname: '임수진',
      avatarUrl: null,
      bio: '홈트레이닝 전문 트레이너',
      gender: 'female',
      birthDate: null,
      preferences: ['exercise'],
      createdAt: '2025-07-01T00:00:00Z',
    },
    title: '주 5회 홈트레이닝',
    description: '집에서도 효과적으로 운동할 수 있는 홈트레이닝 루틴입니다. 기구 없이 맨몸으로 할 수 있는 운동 위주로 구성했습니다.',
    category: 'exercise',
    imageUrl: null,
    price1week: 8900,
    price4week: 26900,
    price100days: 64900,
    isPublished: true,
    purchaseCount: 245,
    ratingAvg: 4.6,
    createdAt: '2025-10-15T00:00:00Z',
  },
  {
    id: 'routine-9',
    providerId: 'provider-9',
    provider: {
      id: 'provider-9',
      email: 'han@htb.com',
      nickname: '한도윤',
      avatarUrl: null,
      bio: '비건 라이프 블로거',
      gender: 'male',
      birthDate: null,
      preferences: ['diet'],
      createdAt: '2025-06-01T00:00:00Z',
    },
    title: '비건 식단 도전 30일',
    description: '30일 동안 비건 식단에 도전해보세요. 매일 간단하면서도 맛있는 비건 레시피와 영양 균형 가이드를 제공합니다.',
    category: 'diet',
    imageUrl: null,
    price1week: 11900,
    price4week: 34900,
    price100days: 84900,
    isPublished: true,
    purchaseCount: 89,
    ratingAvg: 4.2,
    createdAt: '2025-11-15T00:00:00Z',
  },
  {
    id: 'routine-10',
    providerId: 'provider-10',
    provider: {
      id: 'provider-10',
      email: 'song@htb.com',
      nickname: '송예린',
      avatarUrl: null,
      bio: '독서 모임 운영자',
      gender: 'female',
      birthDate: null,
      preferences: ['selfdev'],
      createdAt: '2025-08-01T00:00:00Z',
    },
    title: '독서 습관 만들기',
    description: '매일 30분 독서로 연간 50권 읽기에 도전하세요. 장르별 추천 도서 리스트와 독서 노트 작성법을 함께 제공합니다.',
    category: 'selfdev',
    imageUrl: null,
    price1week: 6900,
    price4week: 19900,
    price100days: 49900,
    isPublished: true,
    purchaseCount: 167,
    ratingAvg: 4.5,
    createdAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'routine-11',
    providerId: 'provider-11',
    provider: {
      id: 'provider-11',
      email: 'oh@htb.com',
      nickname: '오세준',
      avatarUrl: null,
      bio: '수능 수학 전문 강사',
      gender: 'male',
      birthDate: null,
      preferences: ['study'],
      createdAt: '2025-09-01T00:00:00Z',
    },
    title: '수능 수학 매일 풀기',
    description: '수능 수학 1등급을 위한 매일 학습 루틴입니다. 유형별 문제 풀이와 오답 노트 정리법을 체계적으로 안내합니다.',
    category: 'study',
    imageUrl: null,
    price1week: 13900,
    price4week: 39900,
    price100days: 99900,
    isPublished: true,
    purchaseCount: 76,
    ratingAvg: 4.0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'routine-12',
    providerId: 'provider-12',
    provider: {
      id: 'provider-12',
      email: 'na@htb.com',
      nickname: '나은서',
      avatarUrl: null,
      bio: '공인중개사 합격 수기 저자',
      gender: 'female',
      birthDate: null,
      preferences: ['cert'],
      createdAt: '2025-10-01T00:00:00Z',
    },
    title: '공인중개사 60일 완성',
    description: '60일 안에 공인중개사 시험을 준비하는 집중 학습 루틴입니다. 과목별 핵심 정리와 기출 문제 풀이 스케줄을 제공합니다.',
    category: 'cert',
    imageUrl: null,
    price1week: 12900,
    price4week: 37900,
    price100days: 94900,
    isPublished: true,
    purchaseCount: 53,
    ratingAvg: 4.1,
    createdAt: '2026-01-15T00:00:00Z',
  },
];

// Mock routine items (preview data for detail page)
export const MOCK_ROUTINE_ITEMS: Record<string, RoutineItem[]> = {
  'routine-1': [
    { id: 'item-1-1', routineId: 'routine-1', dayNumber: 1, title: '스트레칭 10분', description: '전신 스트레칭으로 몸을 풀어줍니다', sortOrder: 1 },
    { id: 'item-1-2', routineId: 'routine-1', dayNumber: 1, title: '유산소 30분', description: '가벼운 조깅 또는 빠르게 걷기', sortOrder: 2 },
    { id: 'item-1-3', routineId: 'routine-1', dayNumber: 2, title: '근력 운동', description: '상체 근력 운동 (팔굽혀펴기, 덤벨)', sortOrder: 1 },
    { id: 'item-1-4', routineId: 'routine-1', dayNumber: 2, title: '플랭크 3세트', description: '코어 강화를 위한 플랭크 운동', sortOrder: 2 },
    { id: 'item-1-5', routineId: 'routine-1', dayNumber: 3, title: '하체 운동', description: '스쿼트 + 런지 각 3세트', sortOrder: 1 },
    { id: 'item-1-6', routineId: 'routine-1', dayNumber: 3, title: '쿨다운 스트레칭', description: '하체 중심 스트레칭 10분', sortOrder: 2 },
  ],
  'routine-2': [
    { id: 'item-2-1', routineId: 'routine-2', dayNumber: 1, title: '공복 수분 섭취', description: '기상 후 물 500ml 마시기', sortOrder: 1 },
    { id: 'item-2-2', routineId: 'routine-2', dayNumber: 1, title: '첫 식사 준비', description: '12시 식사: 단백질 중심 메뉴', sortOrder: 2 },
    { id: 'item-2-3', routineId: 'routine-2', dayNumber: 2, title: '식단 기록', description: '먹은 음식 칼로리 기록하기', sortOrder: 1 },
    { id: 'item-2-4', routineId: 'routine-2', dayNumber: 2, title: '간식 관리', description: '건강한 간식 준비 (견과류, 과일)', sortOrder: 2 },
    { id: 'item-2-5', routineId: 'routine-2', dayNumber: 3, title: '저녁 식사', description: '20시 전 마지막 식사 완료', sortOrder: 1 },
    { id: 'item-2-6', routineId: 'routine-2', dayNumber: 3, title: '수분 체크', description: '하루 물 2L 섭취 확인', sortOrder: 2 },
  ],
};

// Generate default preview items for routines without specific items
function getDefaultPreviewItems(routineId: string): RoutineItem[] {
  return [
    { id: `${routineId}-d1-1`, routineId, dayNumber: 1, title: '목표 설정하기', description: '오늘의 학습/실천 목표를 정합니다', sortOrder: 1 },
    { id: `${routineId}-d1-2`, routineId, dayNumber: 1, title: '핵심 활동 수행', description: '메인 루틴 활동을 실행합니다', sortOrder: 2 },
    { id: `${routineId}-d2-1`, routineId, dayNumber: 2, title: '복습 및 정리', description: '전날 내용을 복습하고 정리합니다', sortOrder: 1 },
    { id: `${routineId}-d2-2`, routineId, dayNumber: 2, title: '심화 학습', description: '심화 단계로 넘어갑니다', sortOrder: 2 },
    { id: `${routineId}-d3-1`, routineId, dayNumber: 3, title: '실전 연습', description: '실전 감각을 익히는 연습', sortOrder: 1 },
    { id: `${routineId}-d3-2`, routineId, dayNumber: 3, title: '성과 기록', description: '오늘의 성과를 기록합니다', sortOrder: 2 },
  ];
}

interface RoutineStoreState {
  routines: Routine[];
  featuredRoutines: Routine[];
  selectedCategory: string;
  isLoading: boolean;
  setCategory: (cat: string) => void;
  getRoutineById: (id: string) => Routine | undefined;
  getFilteredRoutines: () => Routine[];
  getRoutineItems: (routineId: string) => RoutineItem[];
}

export const useRoutineStore = create<RoutineStoreState>((set, get) => ({
  routines: MOCK_ROUTINES,
  featuredRoutines: [...MOCK_ROUTINES]
    .sort((a, b) => b.purchaseCount - a.purchaseCount)
    .slice(0, 10),
  selectedCategory: 'all',
  isLoading: false,

  setCategory: (cat: string) => {
    set({ selectedCategory: cat });
  },

  getRoutineById: (id: string) => {
    return get().routines.find((r) => r.id === id);
  },

  getFilteredRoutines: () => {
    const { routines, selectedCategory } = get();
    if (selectedCategory === 'all') {
      return routines.filter((r) => r.isPublished);
    }
    return routines.filter(
      (r) => r.isPublished && r.category === selectedCategory
    );
  },

  getRoutineItems: (routineId: string) => {
    return MOCK_ROUTINE_ITEMS[routineId] ?? getDefaultPreviewItems(routineId);
  },
}));
