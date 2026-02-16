# 💰 Commerce Team — Agent Context

## 역할
루틴 구매/결제 플로우 전체 구현 + Product Detail 보강

## 담당 화면 (4~5개)

### PURCHASE-01: Period Selection (Bottom Sheet)
- 트리거: Product Detail에서 "내 루틴에 추가하기" 탭
- Bottom Sheet 모달 구성:
  - 루틴 제목 + Provider 이름
  - 기간 선택 라디오:
    - 1 WEEK — ₩1,400
    - 4 WEEK — ₩5,600
    - 100 Days — ₩20,000
  - "구매하기" CTA (선택 가격 표시)

### PURCHASE-02: Payment Method
- 결제 금액 표시
- 결제 수단: 카드 / 카카오페이 / 토스 / 네이버페이
- 저장된 결제 수단 표시 (있을 경우)
- CTA: "결제하기"

### PURCHASE-03: Payment Confirmation
- 결제 완료 체크마크 아이콘
- "결제가 완료되었습니다!"
- 루틴 이름 + 기간 + 금액
- "일정 설정하기" CTA → 일정선택 화면
- "나중에 설정할게요" 텍스트 링크 → HOME

### PURCHASE-04: Purchase History (MY Page 하위)
- 구매 내역 리스트
  - 날짜, 루틴 이름, Provider, 금액, 기간
  - 상태: 진행중 / 완료 / 환불
- 액션: 상세 보기 → 영수증 / 환불 요청

### Product Detail 보강 (기존 화면)
- 💰 가격 표시 추가
- ⭐ 리뷰/평점 추가
- 📊 구매자 수 추가

## 파일 구조
```
mobile/
├── app/
│   ├── routine/[id].tsx         # 루틴 상세 (보강)
│   └── purchase/
│       ├── select-period.tsx    # 기간 선택
│       ├── payment.tsx          # 결제 수단
│       └── confirmation.tsx     # 결제 완료
└── src/features/commerce/
    ├── components/
    │   ├── PeriodSelector.tsx
    │   ├── PaymentMethodCard.tsx
    │   ├── PriceDisplay.tsx
    │   └── PurchaseHistoryItem.tsx
    ├── hooks/
    │   └── usePurchase.ts
    ├── stores/
    │   └── purchaseStore.ts
    └── types.ts
```

## 연동 API (Backend Team)
- `POST /api/payments/create` — 결제 생성
- `POST /api/payments/confirm` — 결제 확인
- `GET /api/payments/history` — 구매 내역 조회
- `POST /api/payments/refund` — 환불 요청
- `GET /api/routines/:id` — 루틴 상세 (가격, 리뷰 포함)

## Zustand Store
```typescript
// stores/purchaseStore.ts
interface PurchaseStore {
  selectedPeriod: '1week' | '4week' | '100days' | null;
  selectedPayment: string | null;
  isProcessing: boolean;
  setPeriod: (period) => void;
  setPayment: (method) => void;
  processPurchase: (routineId, period) => Promise<PurchaseResult>;
  getPurchaseHistory: () => Promise<Purchase[]>;
}
```

## 가격 구조 참조
```
1 WEEK:   ₩1,400 (7일)
4 WEEK:   ₩5,600 (28일)
100 Days: ₩20,000 (100일)
플랫폼 수수료: 10~20% (공급자 정산 80~90%)
```

## User Flow
```
Product Detail → "내 루틴에 추가하기"
→ Period Selection (Bottom Sheet)
→ Payment Method
→ Payment Confirmation
  ├── "일정 설정하기" → Schedule Select (기존 화면)
  └── "나중에 설정할게요" → HOME
```
