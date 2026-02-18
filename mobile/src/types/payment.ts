import { PeriodKey } from './routine';

export type PaymentStatus = 'pending' | 'completed' | 'refunded';

export interface Purchase {
  id: string;
  userId: string;
  routineId: string;
  routineTitle: string;
  routineImageUrl: string | null;
  period: PeriodKey;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  startedAt: string;
  endsAt: string;
  createdAt: string;
}
