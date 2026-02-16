# HTB Claude Team — 팀 구성 개요

## 프로젝트
**How To Be (HTB)** — 전문가 루틴 마켓플레이스 모바일 앱

## MVP 범위
P0 (Onboarding/Auth + MY Page) + 결제 시스템 (P1)

## 기술 스택
| 영역 | 기술 |
|------|------|
| Frontend | React Native (Expo SDK 53) + Expo Router + TypeScript |
| Styling | NativeWind (Tailwind CSS for RN) |
| State | Zustand |
| Icons | Lucide React Native |
| Backend | Node.js + Express + TypeScript |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| OTA 배포 | EAS Update |
| Web 지원 | Expo Web (expo-router) |

## 팀 구성

```
Orchestrator (사용자 + 메인 Claude)
│
├── 🏗️ Agent 1: Foundation Team
│   └── 공통 컴포넌트, 네비게이션, 디자인 시스템, 타입 정의
│
├── 🚀 Agent 2: Onboarding Team
│   └── Splash, Walkthrough, Login, SignUp, Preference Setup
│
├── 💰 Agent 3: Commerce Team
│   └── Purchase Flow, Payment, Product Detail 보강
│
├── 👤 Agent 4: MY Page Team
│   └── Profile, My Routines, Settings, QR Center
│
├── 🔧 Agent 5: Backend Team
│   └── API 설계, DB 스키마, Auth, 결제 연동
│
└── 🧪 Agent 6: QA & Integration
    └── 전체 Flow 검증, 테스트, 빌드 확인
```

## 작업 순서

### Phase 1: 기반 (Foundation)
1. Foundation Team → 공통 컴포넌트 + 네비게이션 셸
2. Backend Team → DB 스키마 + Auth API

### Phase 2: 핵심 기능 (Core Features) — 병렬 작업 가능
3. Onboarding Team → 온보딩 + 인증 플로우
4. Commerce Team → 구매/결제 플로우
5. MY Page Team → 프로필 + 설정

### Phase 3: 통합 (Integration)
6. QA & Integration → 전체 연결 + 테스트 + 빌드

## 에이전트 호출 방법

각 에이전트는 Task 도구의 sub-agent로 실행됩니다.
에이전트별 상세 컨텍스트는 `agents/` 폴더의 개별 파일을 참조합니다.

```
agents/
├── team-overview.md          # 이 파일 (전체 구조)
├── foundation.md             # Foundation Team 컨텍스트
├── onboarding.md             # Onboarding Team 컨텍스트
├── commerce.md               # Commerce Team 컨텍스트
├── mypage.md                 # MY Page Team 컨텍스트
└── backend.md                # Backend Team 컨텍스트
```
