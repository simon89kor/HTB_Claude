# CLAUDE.md

## Project Overview

**How To Be (HTB)** — 전문가/인플루언서의 Pre-made To-Do List(루틴)를 구매하고 실행할 수 있는 모바일 앱 서비스

- **Target**: 루틴/습관 형성에 관심 있는 2030 세대
- **Platform**: Mobile App (iOS / Android / Web)
- **MVP Scope**: P0 (Onboarding/Auth + MY Page) + 결제 시스템

## Repository Structure

```
HTB_Claude/
├── CLAUDE.md                    # 이 파일 (프로젝트 마스터 가이드)
├── README.md
├── docs/                        # 참조 문서
│   ├── HTB_context.md           # 서비스 전체 컨텍스트 (IA, 디자인, 스펙)
│   ├── How_to_be_ia.html        # IA 시각화 + Gap Analysis
│   └── HTB_종합_컨설팅_보고서.docx  # 사업 타당성 보고서
├── agents/                      # Claude 팀 에이전트 컨텍스트
│   ├── team-overview.md         # 팀 구조 개요
│   ├── foundation.md            # Foundation Team
│   ├── onboarding.md            # Onboarding Team
│   ├── commerce.md              # Commerce Team
│   ├── mypage.md                # MY Page Team
│   └── backend.md               # Backend Team
├── mobile/                      # Expo React Native 앱
│   ├── app/                     # Expo Router (파일 기반 라우팅)
│   ├── src/
│   │   ├── components/common/   # 공통 UI 컴포넌트
│   │   ├── features/            # 기능별 모듈
│   │   │   ├── onboarding/
│   │   │   ├── home/
│   │   │   ├── commerce/
│   │   │   ├── board/
│   │   │   ├── community/
│   │   │   ├── my/
│   │   │   └── reward/
│   │   ├── hooks/               # 공통 커스텀 훅
│   │   ├── stores/              # Zustand 스토어
│   │   ├── services/            # API 서비스
│   │   ├── theme/               # 디자인 토큰
│   │   ├── types/               # 공유 타입
│   │   └── utils/               # 유틸리티
│   └── assets/
└── server/                      # Backend API
    └── src/
        ├── routes/
        ├── controllers/
        ├── services/
        ├── middleware/
        ├── config/
        └── types/
```

## Tech Stack

| 영역 | 기술 |
|------|------|
| Frontend | React Native (Expo SDK 53) + Expo Router + TypeScript |
| Styling | NativeWind (Tailwind CSS for RN) |
| State | Zustand |
| Icons | Lucide React Native |
| Backend | Node.js + Express + TypeScript |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| OTA 배포 | EAS Update (앱스토어 심사 없이 JS 업데이트) |
| Web | Expo Web (expo-router로 웹 동시 지원) |

## Development Workflow

### Install & Run

```bash
# Frontend (Mobile/Web)
cd mobile
npm install
npm run web          # 웹 브라우저에서 실행
npm run ios          # iOS 시뮬레이터
npm run android      # Android 에뮬레이터

# Backend
cd server
npm install
npm run dev          # 개발 서버 (tsx watch)
```

### Build & Deploy

```bash
# EAS Build (네이티브 빌드)
cd mobile
npx eas build --platform ios
npx eas build --platform android

# OTA Update (JS만 업데이트 — 앱스토어 심사 불필요)
npx eas update --branch production
```

## Git Conventions

- **Default branch**: `master`
- **Feature branches**: `claude/` prefix (e.g., `claude/feature-name-id`)
- **Commits**: 한글 또는 영문, 명확하고 간결하게

## Claude Team Structure

```
Orchestrator (사용자 + 메인 Claude)
│
├── 🏗️ Foundation Team    → 공통 컴포넌트, 네비게이션, 디자인 시스템
├── 🚀 Onboarding Team    → Splash, Walkthrough, Login, SignUp, Preference
├── 💰 Commerce Team      → Purchase Flow, Payment, Product Detail
├── 👤 MY Page Team        → Profile, Routines, Settings, QR Center
├── 🔧 Backend Team        → API, DB 스키마, Auth, 결제 연동
└── 🧪 QA & Integration   → 전체 Flow 검증, 테스트, 빌드
```

각 에이전트의 상세 역할/담당 화면/API 스펙은 `agents/` 폴더 참조.

### 작업 순서
1. **Phase 1 — 기반**: Foundation (공통 컴포넌트 + 네비게이션) + Backend (DB + Auth)
2. **Phase 2 — 핵심**: Onboarding + Commerce + MY Page (병렬 작업 가능)
3. **Phase 3 — 통합**: QA & Integration (전체 연결 + 테스트)

## Coding Conventions

### TypeScript
- 모든 코드는 TypeScript strict mode
- `any` 사용 금지, 명시적 타입 정의
- 인터페이스는 `I` 접두사 없이 사용 (e.g., `User`, `Routine`)

### React Native / Expo
- 함수형 컴포넌트 + hooks만 사용
- 파일명: PascalCase (컴포넌트), camelCase (유틸/훅)
- 한 파일에 하나의 export default 컴포넌트
- Expo Router의 파일 기반 라우팅 규칙 준수

### State Management
- Zustand 스토어는 `mobile/src/stores/`에 위치
- 스토어 파일명: `{feature}Store.ts` (e.g., `authStore.ts`)

### Backend
- Express 라우트 → 컨트롤러 → 서비스 패턴
- 에러 핸들링: try-catch + 공통 에러 미들웨어
- Supabase 클라이언트는 서비스 레이어에서만 사용

## Design System Reference

디자인 토큰: `mobile/src/theme/tokens.ts`
상세 스펙: `docs/HTB_context.md` Section 3

### 핵심 컬러
- Primary: `#2dd4a8` (민트 그린)
- Background: `#FFFFFF` / `#F5F5F5`
- Dark: `#1A1A1A`
- Text: `#1A1A1A` / `#888888` / `#BBBBBB`
- Error: `#FF4444`

## Guidelines for AI Assistants

- 작업 전 반드시 해당 에이전트 컨텍스트 파일(`agents/*.md`)을 읽을 것
- `docs/HTB_context.md`의 디자인 시스템과 IA 구조를 준수할 것
- 기존 파일을 읽고 이해한 뒤 수정할 것
- 불필요한 복잡성, 추상화, 기능 추가 금지
- 새 의존성 추가 시 이 파일 업데이트
- 변경사항이 기존 기능을 깨뜨리지 않는지 확인
