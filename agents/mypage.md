# 👤 MY Page Team — Agent Context

## 역할
사용자 프로필, 루틴 관리, 설정 등 MY 탭 전체 구현

## 담당 화면 (8~10개)

### MY-01: My Profile Main
- 프로필 헤더: 원형 사진 (80px) + 닉네임 + 한줄 소개
- 숫자 행: 팔로워 | 팔로잉 | 게시물 (각각 탭 가능)
- "프로필 편집" 버튼
- 메뉴 리스트:
  - 📦 내 루틴
  - 🛒 구매 내역
  - 📱 QR 코드
  - ⚙️ 설정
  - ❓ 고객센터
- 파일: `mobile/app/(tabs)/my.tsx`

### MY-02: Profile Edit
- 프로필 사진 변경 (카메라/갤러리)
- 닉네임 수정
- 한줄 소개 수정
- 성별 / 생년월일 (선택)
- CTA: "저장"

### MY-03: My Routines
- 탭 전환: 진행 중 | 완료 | 직접 만든
- 각 탭: 루틴 카드 (썸네일 + 제목 + Provider + 진행률/완료일)

### MY-04: QR Code Center
- "내 루틴 QR 생성" 섹션: 루틴 선택 → QR 생성
- "QR 스캔" 버튼 (카메라 연결)
- 최근 공유 이력 리스트

### MY-05: Settings
- 설정 메뉴 리스트:
  - 🔔 알림 설정
  - 👤 계정 관리
  - 💳 결제 수단 관리
  - 📄 약관 및 정책
  - ℹ️ 앱 정보 (버전)
  - 🚪 로그아웃
  - ⚠️ 회원탈퇴

### MY-06: Notification Settings
- 토글 스위치 리스트:
  - 일정 알림 (루틴 리마인더) ON/OFF
  - 커뮤니티 알림 (좋아요/댓글) ON/OFF
  - 마케팅 알림 ON/OFF

### MY-07: Following / Followers
- 탭 전환: 팔로잉 | 팔로워
- 각 아이템: 프로필 사진 + 닉네임 + 팔로우/언팔로우 버튼

## 파일 구조
```
mobile/
├── app/
│   ├── (tabs)/my.tsx              # MY 메인
│   └── my/
│       ├── edit-profile.tsx       # 프로필 편집
│       ├── routines.tsx           # 내 루틴
│       ├── qr-center.tsx          # QR 코드 센터
│       ├── settings.tsx           # 설정
│       ├── notifications.tsx      # 알림 설정
│       └── followers.tsx          # 팔로워/팔로잉
└── src/features/my/
    ├── components/
    │   ├── ProfileHeader.tsx
    │   ├── MenuList.tsx
    │   ├── RoutineListItem.tsx
    │   ├── SettingsToggle.tsx
    │   └── FollowerItem.tsx
    ├── hooks/
    │   └── useProfile.ts
    └── types.ts
```

## 연동 API (Backend Team)
- `GET /api/users/me` — 내 프로필
- `PUT /api/users/me` — 프로필 수정
- `GET /api/users/me/routines` — 내 루틴 목록
- `GET /api/users/me/followers` — 팔로워 목록
- `GET /api/users/me/following` — 팔로잉 목록
- `POST /api/users/:id/follow` — 팔로우
- `DELETE /api/users/:id/follow` — 언팔로우
- `PUT /api/users/me/settings` — 설정 저장
- `DELETE /api/users/me` — 회원탈퇴

## Zustand Store
```typescript
// stores/userStore.ts
interface UserStore {
  profile: UserProfile | null;
  routines: Routine[];
  followers: User[];
  following: User[];
  settings: UserSettings;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  fetchRoutines: (filter: 'active' | 'completed' | 'created') => Promise<void>;
  toggleFollow: (userId: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}
```
