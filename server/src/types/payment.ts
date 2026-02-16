export type PeriodType = '1week' | '4week' | '100days';
export type PaymentStatus = 'pending' | 'completed' | 'refunded';

export interface Purchase {
  id: string;
  user_id: string;
  routine_id: string;
  period: PeriodType;
  amount: number;
  status: PaymentStatus;
  payment_method: string | null;
  started_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface CreatePaymentDto {
  routine_id: string;
  period: PeriodType;
  payment_method: string;
}
