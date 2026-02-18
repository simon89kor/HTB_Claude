# 🏗️ Foundation Team — Agent Context

## 역할
공통 UI 컴포넌트, 네비게이션 구조, 디자인 시스템 구현, 공유 타입/유틸리티 담당

## 담당 영역
- `mobile/src/components/common/` — 재사용 가능한 공통 컴포넌트
- `mobile/src/theme/` — 디자인 토큰, 테마 설정
- `mobile/src/types/` — 공유 TypeScript 타입
- `mobile/src/utils/` — 유틸리티 함수
- `mobile/src/hooks/` — 공통 커스텀 훅
- `mobile/app/_layout.tsx` — 루트 레이아웃
- `mobile/app/(tabs)/_layout.tsx` — 탭 네비게이션

## 구현할 공통 컴포넌트

### 버튼
- `Button` — CTA 버튼 (Primary: #2dd4a8, Secondary, Ghost)
- `IconButton` — 아이콘 전용 버튼

### 카드
- `RoutineCard` — 루틴 리스트용 카드 (썸네일 + Provider + 제목 + 태그)
- `DashboardCard` — 대시보드 루틴 카드 (확장/접힘)

### 입력
- `TextInput` — 커스텀 입력 필드 (라벨 + 에러)
- `Chip` — 카테고리/기간 선택 칩
- `Checkbox` — 투두 체크박스

### 레이아웃
- `Screen` — 화면 래퍼 (SafeArea + 패딩)
- `Header` — 화면 상단 헤더 (뒤로가기 + 제목 + 액션)
- `BottomSheet` — 바텀 시트 모달
- `Divider` — 구분선

### 피드백
- `EmptyState` — 빈 상태 안내 (아이콘 + 메시지 + CTA)
- `Toast` — 토스트 알림
- `Avatar` — 프로필 이미지 (원형)
- `Badge` — 상태 뱃지/태그

## 네비게이션 구조 (Expo Router)

```
app/
├── _layout.tsx              # 루트 레이아웃 (AuthProvider 등)
├── (auth)/                  # 인증 그룹 (로그인 전)
│   ├── _layout.tsx
│   ├── splash.tsx
│   ├── walkthrough.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   └── preference.tsx
├── (tabs)/                  # 메인 탭 (로그인 후)
│   ├── _layout.tsx          # Bottom Tab Navigator
│   ├── index.tsx            # HOME
│   ├── post.tsx             # POST (커뮤니티)
│   ├── board.tsx            # BOARD (투두)
│   ├── reward.tsx           # REWARD
│   └── my.tsx               # MY
├── routine/
│   └── [id].tsx             # 루틴 상세
├── purchase/
│   └── [id].tsx             # 구매 플로우
└── +not-found.tsx
```

## 디자인 시스템 참조
- 토큰: `mobile/src/theme/tokens.ts` (이미 생성됨)
- Figma 기준: docs/HTB_context.md Section 3 참조

## Bottom Navigation 스펙
| 탭 | 아이콘 | 라벨 | 설명 |
|----|--------|------|------|
| HOME | 🏠 Home | HOME | 루틴 스토어 |
| POST | ✍️ PenSquare | POST | 커뮤니티 |
| BOARD | ✅ CheckSquare | BOARD | 투두 보드 |
| REWARD | 🏆 Trophy | REWARD | 보상/달성 |
| MY | 👤 User | MY | 프로필 |

- 활성 탭: `#2dd4a8`
- 비활성 탭: `#888888`
- 배경: `#1A1A1A`
- 높이: 60px
