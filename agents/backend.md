# 🔧 Backend Team — Agent Context

## 역할
API 서버 설계/구현, Supabase DB 스키마 설계, 인증/결제 연동

## 기술 스택
- Runtime: Node.js + TypeScript
- Framework: Express
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth (소셜 로그인 포함)
- Storage: Supabase Storage (프로필 이미지, 루틴 이미지)
- Payment: 토스페이먼츠 or 아임포트 (추후 연동)

## Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Supabase Auth UID |
| email | text | 이메일 |
| nickname | varchar(12) | 닉네임 |
| avatar_url | text | 프로필 이미지 URL |
| bio | varchar(100) | 한줄 소개 |
| gender | varchar(10) | 성별 (선택) |
| birth_date | date | 생년월일 (선택) |
| preferences | text[] | 관심 카테고리 |
| created_at | timestamptz | 가입일 |

### routines
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| provider_id | uuid (FK→users) | 제공자 |
| title | varchar(100) | 루틴 제목 |
| description | text | 설명 |
| category | varchar(20) | 카테고리 |
| image_url | text | 썸네일 |
| price_1week | integer | 1주 가격 (원) |
| price_4week | integer | 4주 가격 (원) |
| price_100days | integer | 100일 가격 (원) |
| is_published | boolean | 공개 여부 |
| purchase_count | integer | 구매 수 |
| rating_avg | decimal(2,1) | 평균 평점 |
| created_at | timestamptz | |

### routine_items (루틴 내 투두 아이템)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| routine_id | uuid (FK→routines) | |
| day_number | integer | N일차 |
| title | text | 투두 제목 |
| description | text | 설명 |
| sort_order | integer | 정렬 순서 |

### purchases
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| user_id | uuid (FK→users) | 구매자 |
| routine_id | uuid (FK→routines) | 루틴 |
| period | varchar(10) | 1week/4week/100days |
| amount | integer | 결제 금액 (원) |
| status | varchar(20) | pending/completed/refunded |
| payment_method | varchar(20) | 결제 수단 |
| started_at | date | 루틴 시작일 |
| ends_at | date | 루틴 종료일 |
| created_at | timestamptz | |

### user_todos (사용자별 투두 실행 기록)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| user_id | uuid (FK→users) | |
| purchase_id | uuid (FK→purchases) | |
| routine_item_id | uuid (FK→routine_items) | |
| scheduled_date | date | 예정일 |
| completed_at | timestamptz | 완료 시각 (null=미완료) |
| is_skipped | boolean | 건너뛰기 |

### follows
| Column | Type | Description |
|--------|------|-------------|
| follower_id | uuid (FK→users) | |
| following_id | uuid (FK→users) | |
| created_at | timestamptz | |
| PK | (follower_id, following_id) | |

### posts (커뮤니티)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| user_id | uuid (FK→users) | 작성자 |
| routine_id | uuid (FK→routines) | 연결된 루틴 (nullable) |
| title | varchar(100) | 제목 |
| content | text | 본문 |
| image_urls | text[] | 이미지 URL 배열 |
| hashtags | text[] | 해시태그 |
| category | varchar(20) | 유형 |
| like_count | integer | 좋아요 수 |
| comment_count | integer | 댓글 수 |
| created_at | timestamptz | |

## API Endpoints

### Auth
```
POST   /api/auth/signup          이메일 가입
POST   /api/auth/login           이메일 로그인
POST   /api/auth/social          소셜 로그인
POST   /api/auth/logout          로그아웃
POST   /api/auth/refresh         토큰 갱신
POST   /api/auth/forgot-password 비밀번호 찾기
```

### Users
```
GET    /api/users/me             내 프로필
PUT    /api/users/me             프로필 수정
DELETE /api/users/me             회원탈퇴
PUT    /api/users/me/preference  관심 카테고리 저장
PUT    /api/users/me/settings    설정 저장
GET    /api/users/me/routines    내 루틴 목록
GET    /api/users/me/followers   내 팔로워
GET    /api/users/me/following   내 팔로잉
GET    /api/users/:id            유저 프로필 조회
POST   /api/users/:id/follow     팔로우
DELETE /api/users/:id/follow     언팔로우
```

### Routines
```
GET    /api/routines             루틴 목록 (검색, 필터, 정렬)
GET    /api/routines/top         TOP 10 루틴
GET    /api/routines/:id         루틴 상세
GET    /api/routines/:id/items   루틴 아이템(투두) 목록
GET    /api/routines/:id/reviews 루틴 리뷰
```

### Payments
```
POST   /api/payments/create      결제 생성
POST   /api/payments/confirm     결제 확인
GET    /api/payments/history     구매 내역
POST   /api/payments/refund      환불 요청
```

### Dashboard (Todos)
```
GET    /api/todos/weekly         주간 투두 목록
GET    /api/todos/monthly        월간 투두 목록
PUT    /api/todos/:id/complete   투두 완료 처리
PUT    /api/todos/:id/skip       투두 건너뛰기
```

## 파일 구조
```
server/
├── src/
│   ├── index.ts               # Express 앱 진입점
│   ├── config/
│   │   ├── supabase.ts        # Supabase 클라이언트
│   │   └── env.ts             # 환경 변수
│   ├── middleware/
│   │   ├── auth.ts            # JWT 인증 미들웨어
│   │   └── validate.ts        # 입력 검증
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── routines.ts
│   │   ├── payments.ts
│   │   └── todos.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── routineController.ts
│   │   ├── paymentController.ts
│   │   └── todoController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── routineService.ts
│   │   ├── paymentService.ts
│   │   └── todoService.ts
│   └── types/
│       ├── user.ts
│       ├── routine.ts
│       ├── payment.ts
│       └── todo.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── package.json
└── tsconfig.json
```

## Supabase RLS (Row Level Security) 정책
- users: 본인만 수정 가능, 공개 프로필은 누구나 읽기
- purchases: 본인 구매 기록만 접근
- user_todos: 본인 투두만 접근
- routines: 공개된 루틴은 누구나 읽기, 작성자만 수정
- follows: 본인의 팔로우 관계만 생성/삭제
