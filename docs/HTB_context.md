How To Be (HTB) — 전체 프로젝트 컨텍스트 문서

목적: Claude Code sub-agent 팀이 이 문서를 기반으로 신규 화면을 설계·구현할 수 있도록 서비스의 모든 컨텍스트를 전달
작성일: 2026.02.15
버전: 1.0


1. SERVICE OVERVIEW
1-1. 서비스 정의
How To Be는 전문가/인플루언서가 만든 **Pre-made To-Do List(루틴)**를 구매하고 실행할 수 있는 모바일 앱 서비스입니다.

핵심 컨셉: "남의 To-Do List를 살 수 있다면?"
Target: 루틴/습관 형성에 관심 있는 2030 세대
Platform: Mobile App (iOS / Android)

1-2. 비즈니스 모델
항목내용3자 모델Routine Provider → HTB(플랫폼) → User수익원 1루틴 판매 수수료 (10~20%)수익원 2QR 코드 생성 수수료가격 구조1 WEEK: ₩1,400 / 4 WEEK: ₩5,600 / 100 Days: ₩20,000
1-3. 핵심 차별화 요소

Pre-made To-Do List: 전문가가 설계한 루틴을 바로 내 일정에 추가
카테고리 기반 루틴: 운동, 식단관리, 자기계발, 자격증, 학업 등
QR Code 공유: 루틴을 QR로 생성해서 오프라인/SNS 공유
커뮤니티 (SNS): 루틴 인증 게시물, 팔로잉, 랭킹
Routine Provider 생태계: 인플루언서/전문가가 루틴을 만들고 판매

1-4. 현재 파트너 (IR 기준)

민죠이: 피트니스 인플루언서
윤정훈: 피트니스 트레이너
쌍둥이 엄마 장소윤: 육아+운동 병행 프리랜서


2. INFORMATION ARCHITECTURE
2-1. Bottom Navigation (5 Tabs)
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  HOME   │  POST   │  BOARD  │ REWARD  │   MY    │
│  🏠     │  ✍️     │  ✅     │  🏆     │  👤     │
│루틴스토어│커뮤니티 │투두보드 │보상/달성│프로필    │
└─────────┴─────────┴─────────┴─────────┴─────────┘
2-2. 전체 IA 트리
HOW TO BE App
│
├── [GLOBAL] Onboarding & Auth ⭕ NEW
│   ├── Splash Screen
│   ├── Walkthrough (3~4 slides)
│   │   ├── Slide 1: 전문가 루틴 소개
│   │   ├── Slide 2: To-Do 관리 방식
│   │   └── Slide 3: 커뮤니티 & 공유
│   ├── Sign Up / Login
│   │   ├── 소셜 로그인 (카카오, 애플, 구글)
│   │   ├── 이메일 가입
│   │   ├── 비밀번호 찾기
│   │   └── 약관 동의
│   └── Preference Setup
│       ├── 관심 카테고리 선택
│       ├── 목표 기간 선택
│       └── 첫 루틴 추천 제안
│
├── [TAB 1] HOME — 루틴 스토어
│   ├── HOME Main ✅ EXISTS (HOME01)
│   │   ├── NOW TOP 10 TO-DO 랭킹
│   │   ├── 카테고리 탭 (전체/운동/식단/자기계발)
│   │   ├── 루틴 카드 리스트
│   │   ├── 🔍 검색 바 ⭕ NEW
│   │   ├── 📢 배너/프로모션 ⭕ NEW
│   │   └── 🆕 신규 등록 루틴 ⭕ NEW
│   │
│   ├── Search & Filter ⭕ NEW
│   │   ├── 키워드 검색
│   │   ├── 최근/인기 검색어
│   │   ├── 검색 결과 리스트
│   │   └── 필터 (카테고리, 기간, 가격, 인기순)
│   │
│   ├── Product Detail ✅ EXISTS (PRODUCT01~04)
│   │   ├── Provider 프로필 + 히어로 이미지
│   │   ├── 루틴 설명
│   │   ├── 루틴 미리보기 (일부 공개)
│   │   ├── 카테고리/기간 태그
│   │   ├── CTA: "내 루틴에 추가하기"
│   │   ├── 💰 가격 표시 ⭕ NEW
│   │   ├── ⭐ 리뷰/평점 ⭕ NEW
│   │   └── 📊 구매자 수 ⭕ NEW
│   │
│   ├── Purchase Flow ⭕ NEW
│   │   ├── 기간 선택 Bottom Sheet (1주/4주/100일)
│   │   ├── 가격 확인
│   │   ├── 결제 수단 선택
│   │   ├── 결제 완료 확인
│   │   └── 일정 선택 연결
│   │
│   ├── Schedule Select ✅ EXISTS (일정선택01-01~04)
│   │   ├── 시작일 캘린더
│   │   ├── 종료일 캘린더
│   │   └── 기간 자동 계산 안내
│   │
│   └── Provider Profile ⭕ NEW
│       ├── Provider 소개 / 경력
│       ├── 제공 루틴 목록
│       ├── 팔로워 수 / 총 판매량
│       └── 리뷰 모아보기
│
├── [TAB 2] POST — 커뮤니티
│   ├── Community Feed ✅ EXISTS (COMMUNITY01)
│   │   ├── 탭: 팔로잉 / MY TO-BE / NOW / 랭킹 / 갓생살기 / 다이어트
│   │   ├── 게시물 카드 (이미지 + 루틴 뱃지)
│   │   ├── 좋아요 / 댓글 / 관심
│   │   └── 검색바 + QR 스캐너
│   │
│   ├── Post Detail ✅ EXISTS (COMMUNITY POST01)
│   │   ├── 이미지 뷰어
│   │   ├── 연결된 루틴 뱃지
│   │   ├── 인터랙션 (좋아요/댓글/관심)
│   │   ├── 댓글 리스트 ⭕ ENHANCE
│   │   └── 신고/차단 ⭕ NEW
│   │
│   ├── Post Create ✅ EXISTS (COMMUNITY작성01~06)
│   │   ├── 사진 선택 (갤러리)
│   │   ├── 사진 편집/필터
│   │   ├── 제목 / 본문 / 해시태그
│   │   ├── 유형 선택
│   │   ├── 루틴 연결
│   │   └── 게시 완료
│   │
│   ├── User Profile View ⭕ NEW
│   │   ├── 유저 정보 / 소개
│   │   ├── 게시물 그리드
│   │   ├── 팔로우 버튼
│   │   └── 사용 중인 루틴 목록
│   │
│   └── Ranking Detail ⭕ NEW
│       ├── 주간/월간 랭킹
│       ├── 카테고리별 랭킹
│       └── 내 순위 확인
│
├── [TAB 3] BOARD — 투두 대시보드
│   ├── Weekly View ✅ EXISTS (DASHBOARD01, 02-01~03)
│   │   ├── 요일 네비게이션 (Sun~Sat)
│   │   ├── 루틴 카드 (확장/접힘)
│   │   ├── 투두 아이템 체크
│   │   ├── D-Day 카운터
│   │   ├── "HOW TO BE 추가하기" CTA
│   │   └── Empty State
│   │
│   ├── Monthly View ✅ EXISTS (DASHBOARD03-01~02)
│   │   ├── 월간 캘린더 (완료 표시)
│   │   └── 날짜별 루틴/투두 표시
│   │
│   ├── Todo Detail Settings ✅ EXISTS (TODO DETAIL01~02)
│   │   ├── 시간 설정
│   │   ├── 매일 반복하기
│   │   ├── 미완료시 내일로 보내기
│   │   ├── 하위 항목 작성
│   │   └── 복사/붙여넣기/삭제
│   │
│   ├── Custom Routine Create ✅ EXISTS (루틴 추가하기01~02)
│   │   ├── 제목 입력
│   │   ├── 루틴 유형 선택 (식단/자기계발/운동/자격증/학업)
│   │   ├── 기한 설정 (1주/4주/100일/무기한)
│   │   ├── 컬러 설정
│   │   ├── D-DAY 표시 여부
│   │   └── 날짜 선택 → 투두 작성
│   │
│   └── Progress & Stats ⭕ NEW
│       ├── 루틴별 완료율 (%) 차트
│       ├── 주간/월간 달성 추이
│       ├── 스트릭 (연속 완료일)
│       └── 카테고리별 시간 분배
│
├── [TAB 4] REWARD — 보상 & 달성 ⭕ ALL NEW
│   ├── Reward Main
│   │   ├── 총 달성 루틴 수
│   │   ├── 연속 달성일 (스트릭)
│   │   ├── 획득 배지 요약
│   │   └── 현재 랭킹 요약
│   │
│   ├── Badge Collection
│   │   ├── 획득 배지 / 미획득 배지 (그리드)
│   │   ├── 배지 상세 (획득 조건, 날짜)
│   │   └── 배지 공유 기능
│   │
│   ├── Ranking Board
│   │   ├── 전체 / 카테고리별 랭킹
│   │   ├── 주간 / 월간 랭킹
│   │   ├── 내 순위 하이라이트
│   │   └── 친구 랭킹
│   │
│   └── Challenge
│       ├── 진행 중 챌린지 리스트
│       ├── 챌린지 상세 / 참여
│       └── 챌린지 보상
│
├── [TAB 5] MY — 프로필 & 설정 ⭕ ALL NEW
│   ├── My Profile
│   │   ├── 프로필 사진 / 닉네임 / 소개
│   │   ├── 팔로워 / 팔로잉 수
│   │   ├── 내 게시물 그리드
│   │   └── 프로필 편집
│   │
│   ├── My Routines
│   │   ├── 진행 중 루틴
│   │   ├── 완료된 루틴
│   │   ├── 구매한 루틴 (구매 내역)
│   │   └── 직접 만든 루틴
│   │
│   ├── QR Code Center
│   │   ├── 내 루틴 QR 생성
│   │   ├── QR 이미지 저장/공유
│   │   ├── QR 스캔 (카메라)
│   │   └── 공유 이력
│   │
│   ├── Following / Followers
│   │   ├── 팔로잉 리스트
│   │   ├── 팔로워 리스트
│   │   └── Provider 팔로잉
│   │
│   └── Settings
│       ├── 알림 설정 (일정/커뮤니티/마케팅)
│       ├── 계정 관리 (이메일/비밀번호/연동)
│       ├── 결제 수단 관리
│       ├── 앱 정보 / 약관 / 개인정보처리방침
│       ├── 고객센터 / FAQ
│       └── 로그아웃 / 회원탈퇴
│
└── [GLOBAL] Notification ✅ EXISTS (알림01-01~03)
    ├── 일정 알림 (루틴 리마인더)
    ├── 커뮤니티 알림 (좋아요/댓글)
    ├── 구매/결제 알림 ⭕ NEW
    └── 알림 설정 바로가기 ⭕ NEW

3. DESIGN SYSTEM (기존 화면에서 추출)
3-1. Color Palette
TokenValueUsage--primary#2dd4a8 (민트 그린)CTA 버튼, 선택 상태, 아이콘 활성--primary-dark#1ab894버튼 hover/pressed--bg-primary#FFFFFF메인 배경--bg-secondary#F5F5F5섹션 배경, 카드 배경--bg-dark#1A1A1A ~ #2A2A2A다크 영역 (PRODUCT 히어로)--text-primary#1A1A1A제목, 본문--text-secondary#888888부가 설명--text-tertiary#BBBBBB비활성 텍스트--border#E5E5E5기본 구분선--error#FF4444에러, 삭제--warning#FFD93D경고
3-2. Typography
StyleSizeWeightUsageDisplay28pxBold (700)대시보드 "TODAY" 타이틀H122pxBold (700)섹션 제목H218pxSemiBold (600)서브 제목H316pxSemiBold (600)카드 제목Body115pxRegular (400)본문 텍스트Body213pxRegular (400)부가 설명Caption11pxRegular (400)라벨, 태그
3-3. Component Patterns
Bottom Navigation Bar

5 tabs: HOME / POST / BOARD / REWARD / MY
아이콘 + 라벨 구조
활성 탭: --primary 색상
비활성 탭: #888888
Height: ~60px
배경: 다크 (#1A1A1A)

Category Tabs (HOME)

수평 스크롤 가능한 칩(Chip) 형태
이모지 + 텍스트: "👀 전체", "💪 운동루틴", "🥗 식단관리", "🎓 자기계발"
선택 시: 밑줄 또는 배경 색상 변경

Routine Card (HOME)

썸네일 이미지 (원형 프로필 + 배경 이미지)
Provider 이름 + 루틴 제목
카테고리 태그 (작은 뱃지)
1열 세로 스크롤 리스트

Product Detail Header

히어로 이미지 (상단 ~40% 영역)
그라데이션 오버레이 (하단 어두움)
Provider 원형 프로필 (작은 크기, 이미지 위)
제목 + 카테고리 태그 (이미지 아래)

Dashboard Routine Card

상단: 루틴 제목 + D-Day 카운터
중앙: 투두 아이템 리스트 (체크박스 + 텍스트)
하단: 진행률 또는 접힘 상태
확장/접힘 토글 가능

Community Post Card

유저 프로필 (원형 + 닉네임 + 시간)
이미지 (정사각형 또는 4:3)
루틴 뱃지 (이미지 하단에 오버레이)
인터랙션 바: 공유 / 좋아요 / 댓글 / 관심

Calendar (일정선택)

월간 캘린더 그리드 (Sun~Sat)
시작일/종료일 탭 전환
선택일: --primary 원형 배경
오늘: 그린 아웃라인

Input Form (루틴 추가)

라벨 위, 인풋 아래 구조
선택 옵션: 칩(Chip) 형태 (운동/식단/자기계발/자격증/학업)
기한: 칩 선택 (1주/4주/100일/무기한)
컬러 선택: 원형 컬러 팔레트


4. EXISTING SCREENS INVENTORY
현재 디자인된 화면: 34개
GroupScreen IDDescriptionStatusHOMEHOME01루틴 스토어 메인 (카테고리 + TOP10)✅ DonePRODUCTPRODUCT01운동루틴 상세 (김종국 헬스장)✅ DonePRODUCTPRODUCT02식단관리 상세 (밀프렙)✅ DonePRODUCTPRODUCT03복합루틴 상세 (쌍둥이 엄마)✅ DonePRODUCTPRODUCT04복합루틴 변형✅ Done알림알림01-01일정 알림 (Empty State)✅ Done알림알림01-02일정 알림 (리스트)✅ Done알림알림01-03커뮤니티 알림✅ Done일정선택일정선택01-01시작일 선택 (기본)✅ Done일정선택일정선택01-02시작일 선택 (선택됨)✅ Done일정선택일정선택01-03종료일 선택✅ Done일정선택일정선택01-04종료일 선택 (기본)✅ DoneTODO DETAILTODO DETAIL01-01상세 설정 (기본)✅ DoneTODO DETAILTODO DETAIL01-02상세 설정 (활성화)✅ DoneTODO DETAILTODO DETAIL02-01하위 항목 (Empty)✅ DoneTODO DETAILTODO DETAIL02-02하위 항목 (입력됨)✅ DoneDASHBOARDDASHBOARD01Empty State✅ DoneDASHBOARDDASHBOARD02-01루틴 카드 확장✅ DoneDASHBOARDDASHBOARD02-02투두 항목 채워짐✅ DoneDASHBOARDDASHBOARD02-03다중 루틴 접힘✅ DoneDASHBOARDDASHBOARD03-01월간 캘린더 뷰✅ DoneDASHBOARDDASHBOARD03-02캘린더 + 루틴 목록✅ Done루틴 추가루틴 추가하기01-01루틴 정보 입력✅ Done루틴 추가루틴 추가하기01-02추가 설정✅ Done루틴 추가루틴 추가하기02-01날짜 선택✅ Done루틴 추가루틴 추가하기02-02To-Do 작성✅ Done루틴 추가루틴 추가하기02-03작성 완료✅ DoneCOMMUNITYCOMMUNITY01피드 목록✅ DoneCOMMUNITYCOMMUNITY POST01 (A)게시물 상세✅ DoneCOMMUNITYCOMMUNITY POST01 (B)게시물 상세 변형✅ DoneCOMMUNITY 작성COMMUNITY작성01사진 선택✅ DoneCOMMUNITY 작성COMMUNITY작성02사진 편집✅ DoneCOMMUNITY 작성COMMUNITY작성03필터 적용✅ DoneCOMMUNITY 작성COMMUNITY작성04-01제목/해시태그 입력✅ DoneCOMMUNITY 작성COMMUNITY작성04-02유형 선택✅ DoneCOMMUNITY 작성COMMUNITY작성05최종 확인✅ DoneCOMMUNITY 작성COMMUNITY작성06-01루틴 연결✅ DoneCOMMUNITY 작성COMMUNITY작성06-02게시 완료✅ Done기타Frame 1161Bottom Navigation Bar (컴포넌트)✅ Done

5. NEW SCREENS SPECIFICATION
Priority: P0 (Critical — 서비스 런칭 필수)

5-1. Onboarding Flow (8~10 screens)
ONBOARD-01: Splash

구성: 화면 중앙에 HTB 로고 + 브랜드 컬러 배경
동작: 2초 후 자동 전환 (또는 API 로딩 완료 시)
디자인 노트:

배경: --primary 그라데이션 또는 화이트
로고: 서비스 로고 (추후 확정)



ONBOARD-02: Walkthrough Slide 1

구성: 일러스트 + 타이틀 + 서브타이틀 + 페이지 인디케이터 + "다음" 버튼
내용: "전문가가 만든 루틴으로 시작하세요" — 전문가 루틴 마켓플레이스 소개
디자인 노트: 일러스트 60% / 텍스트 30% / 네비게이션 10%

ONBOARD-03: Walkthrough Slide 2

내용: "매일 체크하며 나를 바꿔보세요" — To-Do 기반 실행 방식

ONBOARD-04: Walkthrough Slide 3

내용: "함께하면 더 재미있어요" — 커뮤니티 & QR 공유
CTA: "시작하기" 버튼 (로그인/가입으로 이동)

ONBOARD-05: Login/SignUp

구성:

상단: 로고 + 서비스 슬로건
중앙: 소셜 로그인 버튼 3개 (카카오 / 애플 / 구글)
하단: "이메일로 시작하기" 텍스트 링크


디자인 노트:

카카오: 노란 배경 (#FEE500) + 카카오 로고
애플: 블랙 배경 + 애플 로고
구글: 화이트 배경 + 구글 로고 + 보더



ONBOARD-06: Email Sign Up

구성: 이메일 / 비밀번호 / 비밀번호 확인 / 닉네임 입력
Validation: 이메일 형식, 비밀번호 8자 이상, 닉네임 2~12자
CTA: "가입하기" 버튼

ONBOARD-07: Terms Agreement

구성: 전체 동의 체크 + 개별 약관 리스트

[필수] 서비스 이용약관
[필수] 개인정보 처리방침
[선택] 마케팅 정보 수신 동의


CTA: "동의하고 시작하기"

ONBOARD-08: Preference Setup

구성:

"어떤 루틴에 관심이 있나요?" 타이틀
카테고리 칩 선택 (다중 선택): 운동루틴 / 식단관리 / 자기계발 / 자격증 / 학업
최소 1개 선택 필수


CTA: "완료" → HOME으로 이동


5-2. Purchase Flow (4~5 screens)
PURCHASE-01: Period Selection (Bottom Sheet)

트리거: PRODUCT 상세에서 "내 루틴에 추가하기" 탭
구성: Bottom Sheet 모달

루틴 제목 + Provider 이름
기간 선택 라디오:

1 WEEK — ₩1,400
4 WEEK — ₩5,600
100 Days — ₩20,000


"구매하기" CTA 버튼 (선택 가격 표시)



PURCHASE-02: Payment Method

구성:

결제 금액 표시
결제 수단: 카드 / 카카오페이 / 토스 / 네이버페이
저장된 결제 수단 표시 (있을 경우)


CTA: "결제하기"

PURCHASE-03: Payment Confirmation

구성: 결제 완료 아이콘 (체크마크)

"결제가 완료되었습니다!"
루틴 이름 + 기간 + 금액
"일정 설정하기" CTA → 일정선택 화면
"나중에 설정할게요" 텍스트 링크 → HOME



PURCHASE-04: Purchase History (MY Page 하위)

구성: 구매 내역 리스트

날짜, 루틴 이름, Provider, 금액, 기간
상태: 진행중 / 완료 / 환불


액션: 상세 보기 → 영수증 / 환불 요청


5-3. MY Page (8~10 screens)
MY-01: My Profile Main

구성:

프로필 헤더: 원형 사진 (80px) + 닉네임 + 한줄 소개
숫자 행: 팔로워 | 팔로잉 | 게시물 (각각 탭 가능)
"프로필 편집" 버튼
메뉴 리스트:

📦 내 루틴
🛒 구매 내역
📱 QR 코드
⚙️ 설정
❓ 고객센터





MY-02: Profile Edit

구성:

프로필 사진 변경 (카메라/갤러리)
닉네임 수정
한줄 소개 수정
성별 / 생년월일 (선택)


CTA: "저장"

MY-03: My Routines

구성: 탭 전환 — 진행 중 | 완료 | 직접 만든
각 탭 아이템: 루틴 카드 (썸네일 + 제목 + Provider + 진행률/완료일)

MY-04: QR Code Center

구성:

"내 루틴 QR 생성" 섹션: 루틴 선택 → QR 생성
"QR 스캔" 버튼 (카메라 연결)
최근 공유 이력 리스트



MY-05: Settings

구성: 설정 메뉴 리스트

🔔 알림 설정
👤 계정 관리
💳 결제 수단 관리
📄 약관 및 정책
ℹ️ 앱 정보 (버전)
🚪 로그아웃
⚠️ 회원탈퇴



MY-06: Notification Settings

구성: 토글 스위치 리스트

일정 알림 (루틴 리마인더) ON/OFF
커뮤니티 알림 (좋아요/댓글) ON/OFF
마케팅 알림 ON/OFF



MY-07: Following / Followers

구성: 탭 전환 — 팔로잉 | 팔로워
각 아이템: 프로필 사진 + 닉네임 + 팔로우/언팔로우 버튼


5-4. REWARD Tab (6~8 screens)
REWARD-01: Reward Main

구성:

상단 요약 카드: 총 완료 루틴 | 연속 달성일 | 획득 배지 수
"내 배지" 섹션: 최근 획득 배지 3~4개 (횡스크롤) + "전체보기"
"랭킹" 섹션: 내 순위 표시 카드 + "상세보기"
"챌린지" 섹션: 진행 중 챌린지 카드 1~2개



REWARD-02: Badge Collection

구성: 그리드 (3열)

획득 배지: 컬러 아이콘 + 이름
미획득 배지: 회색 처리 + 잠금 아이콘
탭 시 → 상세 Bottom Sheet



REWARD-03: Badge Detail (Bottom Sheet)

구성: 배지 아이콘 (큰 사이즈) + 이름 + 획득 조건 + 획득 날짜
CTA: "공유하기" (커뮤니티 게시 또는 SNS)

REWARD-04: Ranking Board

구성:

탭: 전체 | 운동 | 식단 | 자기계발
기간: 이번 주 | 이번 달
1~3위: 프로필 + 포디움 스타일
4위 이하: 리스트
내 순위 고정 바 (하단)



REWARD-05: Challenge List

구성: 진행 중 / 예정 / 완료 탭
카드: 챌린지 이미지 + 제목 + 기간 + 참여자 수 + 보상

REWARD-06: Challenge Detail

구성:

히어로 이미지 + 제목 + 설명
참여 조건 / 보상 내용
현재 진행률
"참여하기" CTA




5-5. Search & Discovery (3~4 screens)
SEARCH-01: Search Home

트리거: HOME 상단 검색 아이콘 탭
구성:

검색 인풋 (오토포커스)
최근 검색어 (태그 + X 삭제)
인기 검색어 랭킹 (1~10)



SEARCH-02: Search Results

구성:

검색 인풋 (입력된 상태)
필터 바: 전체 / 루틴 / Provider / 커뮤니티
결과 리스트 (루틴 카드 형태)
Empty State: "검색 결과가 없습니다"



SEARCH-03: Filter (Bottom Sheet)

구성:

카테고리: 전체/운동/식단/자기계발 (다중)
기간: 1주/4주/100일
정렬: 인기순/최신순/가격순
"적용" CTA




5-6. QR Code Flow (3~4 screens)
QR-01: QR Generate

트리거: MY > QR Code Center > "QR 생성" 또는 Product Detail > "공유"
구성:

루틴 선택 (내 루틴 리스트에서)
QR 코드 미리보기 (큰 크기)
"이미지 저장" / "공유하기" 버튼



QR-02: QR Scanner

트리거: COMMUNITY 검색바 옆 QR 아이콘 또는 MY > QR 스캔
구성: 카메라 뷰파인더 + 가이드 프레임
스캔 성공 시: 루틴 상세 페이지로 이동

QR-03: QR Scanned Result

구성: 스캔된 루틴 정보 미리보기

Provider + 루틴 제목 + 카테고리
"내 루틴에 추가하기" CTA → Purchase Flow




5-7. Provider Profile (2 screens)
PROVIDER-01: Provider Profile Page

트리거: PRODUCT 상세에서 Provider 이름 탭
구성:

프로필 헤더: 사진 + 이름 + 소개 + 팔로워 수
"팔로우" 버튼
제공 루틴 목록 (루틴 카드 리스트)
리뷰/평점 요약



PROVIDER-02: Provider Routines

구성: 해당 Provider의 전체 루틴 리스트

정렬: 인기순/최신순
각 카드: 루틴 썸네일 + 제목 + 가격 + 구매자 수




6. USER FLOW — 핵심 시나리오
Flow A: 첫 사용자 → 루틴 구매 → 실행
Splash → Walkthrough → Login → Preference Setup
→ HOME (루틴 탐색) → Product Detail → Purchase (기간선택→결제)
→ Schedule Select (시작일/종료일) → BOARD (Weekly View)
→ 매일 투두 체크 → Progress 확인
Flow B: 기존 사용자 → 커뮤니티 인증
HOME → BOARD (투두 완료) → POST (게시물 작성)
→ 사진 선택 → 편집/필터 → 제목/해시태그 → 루틴 연결 → 게시
→ 피드에서 반응 확인 (좋아요/댓글)
Flow C: QR 공유 → 신규 유저 획득
기존 유저: MY → QR Center → 루틴 선택 → QR 생성 → SNS 공유
신규 유저: QR 스캔 → 루틴 상세 → Sign Up → Purchase → BOARD
Flow D: 보상 & Retention Loop
BOARD (투두 완료) → REWARD (스트릭 증가)
→ Badge 획득 알림 → Badge Collection 확인
→ Ranking 확인 → Challenge 참여 → BOARD (계속 실행)

7. IMPLEMENTATION PRIORITY
Phase 1 — MVP Launch (P0)
영역화면 수비고Onboarding/Auth8서비스 진입 필수Purchase Flow4수익 모델 필수MY Page (Core)5프로필, 루틴관리, 설정소계17
Phase 2 — Growth (P1)
영역화면 수비고REWARD Tab6Retention 핵심QR Code Flow3IR 핵심 차별화Search & Discovery3탐색 효율Provider Profile2공급측 강화소계14
Phase 3 — Enhancement (P2)
영역화면 수비고Progress & Stats3데이터 기반 동기부여Community 보강3신고/차단, 랭킹 상세Provider Dashboard4공급측 관리 도구소계10

8. AGENT TEAM 구성 가이드
추천 Sub-Agent 구조
Orchestrator (메인 Agent)
├── Agent 1: Onboarding Team
│   └── Splash, Walkthrough, Login, SignUp, Preference
│
├── Agent 2: Commerce Team
│   └── Purchase Flow, Payment, Product Detail 보강
│
├── Agent 3: MY Page Team
│   └── Profile, Routines, Settings, QR Center
│
├── Agent 4: REWARD Team
│   └── Reward Main, Badge, Ranking, Challenge
│
├── Agent 5: Discovery Team
│   └── Search, Filter, Provider Profile
│
└── Agent 6: Integration & QA
    └── 공통 컴포넌트, 네비게이션, 전체 Flow 검증
각 Agent에게 전달할 컨텍스트

이 문서 전체 (htb-project-context.md)
담당 섹션의 상세 Spec (Section 5의 해당 부분)
Design System (Section 3)
관련 User Flow (Section 6)

기술 스택 권장

Framework: React (Next.js) 또는 React Native
Styling: Tailwind CSS
State: Zustand 또는 React Context
아이콘: Lucide React
차트: Recharts (Progress & Stats용)
Output: 각 Agent가 해당 화면의 .jsx 파일 생성


9. FIGMA FILE REFERENCE
항목값File KeytI2XBr9VMxXVn5129z0nZHFile NameTPZ-POIR Section Node953:1494Design Section Node954:6092Figma URLhttps://www.figma.com/design/tI2XBr9VMxXVn5129z0nZH/TPZ-PO

End of Document — How To Be Project Context v1.0