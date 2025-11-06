import { create } from 'zustand';
import { db, PricingRecord } from '../utils/db';

interface PricingState {
  items: PricingRecord[];
  loading: boolean;
  error?: string;
  loadFromDb: () => Promise<void>;
  replacePricing: (records: PricingRecord[]) => Promise<void>;
}

export const usePricingStore = create<PricingState>((set) => ({
  items: [],
  loading: false,
  async loadFromDb() {
    set({ loading: true, error: undefined });
    try {
      const items = await db.pricing.toArray();
      set({ items, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  async replacePricing(records) {
    set({ loading: true, error: undefined });
    try {
      await db.transaction('rw', db.pricing, async () => {
        await db.pricing.clear();
        await db.pricing.bulkAdd(records);
      });
      set({ items: records, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));
