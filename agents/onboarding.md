# 🚀 Onboarding Team — Agent Context

## 역할
신규 사용자 획득을 위한 온보딩 및 인증 플로우 전체 구현

## 담당 화면 (8~10개)

### ONBOARD-01: Splash
- 화면 중앙에 HTB 로고 + 브랜드 컬러 배경
- 2초 후 자동 전환 (또는 API 로딩 완료 시)
- 배경: `#2dd4a8` 그라데이션 또는 화이트
- 파일: `mobile/app/(auth)/splash.tsx`

### ONBOARD-02~04: Walkthrough (3 slides)
- 슬라이드 1: "전문가가 만든 루틴으로 시작하세요" — 루틴 마켓플레이스 소개
- 슬라이드 2: "매일 체크하며 나를 바꿔보세요" — To-Do 기반 실행
- 슬라이드 3: "함께하면 더 재미있어요" — 커뮤니티 & QR 공유
- 구성: 일러스트 60% / 텍스트 30% / 네비게이션 10%
- 페이지 인디케이터 + "다음" 버튼 / 마지막 슬라이드에 "시작하기" CTA
- 파일: `mobile/app/(auth)/walkthrough.tsx`

### ONBOARD-05: Login/SignUp
- 상단: 로고 + 서비스 슬로건
- 중앙: 소셜 로그인 버튼 3개
  - 카카오: `#FEE500` + 카카오 로고
  - 애플: `#000000` + 애플 로고
  - 구글: `#FFFFFF` + 구글 로고 + 보더
- 하단: "이메일로 시작하기" 텍스트 링크
- 파일: `mobile/app/(auth)/login.tsx`

### ONBOARD-06: Email Sign Up
- 입력: 이메일 / 비밀번호 / 비밀번호 확인 / 닉네임
- Validation: 이메일 형식, 비밀번호 8자 이상, 닉네임 2~12자
- CTA: "가입하기"
- 파일: `mobile/app/(auth)/signup.tsx`

### ONBOARD-07: Terms Agreement
- 전체 동의 체크 + 개별 약관 리스트
  - [필수] 서비스 이용약관
  - [필수] 개인정보 처리방침
  - [선택] 마케팅 정보 수신 동의
- CTA: "동의하고 시작하기"
- signup.tsx 내 스텝 또는 별도 화면

### ONBOARD-08: Preference Setup
- "어떤 루틴에 관심이 있나요?" 타이틀
- 카테고리 칩 다중 선택: 운동루틴 / 식단관리 / 자기계발 / 자격증 / 학업
- 최소 1개 선택 필수
- CTA: "완료" → HOME으로 이동
- 파일: `mobile/app/(auth)/preference.tsx`

## 파일 구조
```
mobile/
├── app/(auth)/
│   ├── _layout.tsx
│   ├── splash.tsx
│   ├── walkthrough.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   └── preference.tsx
└── src/features/onboarding/
    ├── components/
    │   ├── SocialLoginButton.tsx
    │   ├── WalkthroughSlide.tsx
    │   └── CategoryChip.tsx
    ├── hooks/
    │   └── useAuth.ts
    └── types.ts
```

## 연동 API (Backend Team)
- `POST /api/auth/signup` — 이메일 가입
- `POST /api/auth/login` — 이메일 로그인
- `POST /api/auth/social` — 소셜 로그인 (카카오/애플/구글)
- `PUT /api/users/preference` — 관심 카테고리 저장

## Zustand Store
```typescript
// stores/authStore.ts
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (credentials) => Promise<void>;
  signup: (data) => Promise<void>;
  socialLogin: (provider) => Promise<void>;
  logout: () => void;
  setPreferences: (categories: string[]) => void;
}
```

## User Flow
```
Splash → Walkthrough (3 slides) → Login
  ├── 소셜 로그인 → Preference Setup → HOME
  └── 이메일 가입 → Terms → Preference Setup → HOME
```
