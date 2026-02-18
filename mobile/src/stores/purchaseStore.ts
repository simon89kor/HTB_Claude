import { create } from 'zustand';
import { Routine, PeriodKey } from '@/src/types';

interface PurchaseStoreState {
  selectedPeriod: PeriodKey | null;
  selectedRoutine: Routine | null;
  selectedPaymentMethod: string;
  isAgreed: boolean;
  isProcessing: boolean;
  setPeriod: (period: PeriodKey) => void;
  setRoutine: (routine: Routine) => void;
  setPaymentMethod: (method: string) => void;
  setAgreed: (agreed: boolean) => void;
  processPurchase: () => Promise<boolean>;
  reset: () => void;
  getSelectedPrice: () => number;
}

export const usePurchaseStore = create<PurchaseStoreState>((set, get) => ({
  selectedPeriod: null,
  selectedRoutine: null,
  selectedPaymentMethod: 'card',
  isAgreed: false,
  isProcessing: false,

  setPeriod: (period: PeriodKey) => {
    set({ selectedPeriod: period });
  },

  setRoutine: (routine: Routine) => {
    set({ selectedRoutine: routine });
  },

  setPaymentMethod: (method: string) => {
    set({ selectedPaymentMethod: method });
  },

  setAgreed: (agreed: boolean) => {
    set({ isAgreed: agreed });
  },

  processPurchase: async () => {
    set({ isProcessing: true });
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set({ isProcessing: false });
      return true;
    } catch {
      set({ isProcessing: false });
      return false;
    }
  },

  reset: () => {
    set({
      selectedPeriod: null,
      selectedRoutine: null,
      selectedPaymentMethod: 'card',
      isAgreed: false,
      isProcessing: false,
    });
  },

  getSelectedPrice: () => {
    const { selectedRoutine, selectedPeriod } = get();
    if (!selectedRoutine || !selectedPeriod) return 0;
    const priceMap: Record<PeriodKey, number> = {
      '1week': selectedRoutine.price1week,
      '4week': selectedRoutine.price4week,
      '100days': selectedRoutine.price100days,
    };
    return priceMap[selectedPeriod];
  },
}));
