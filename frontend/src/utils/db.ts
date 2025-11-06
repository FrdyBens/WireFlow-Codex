import Dexie, { Table } from 'dexie';

export interface ProjectRecord {
  id?: number;
  name: string;
  data: unknown;
  updatedAt: number;
}

export interface PricingRecord {
  id?: number;
  sku: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  vendor?: string;
  category?: string;
}

class WireFlowDexie extends Dexie {
  projects!: Table<ProjectRecord, number>;
  pricing!: Table<PricingRecord, number>;

  constructor() {
    super('wireflow-db');
    this.version(1).stores({
      projects: '++id, name, updatedAt',
      pricing: '++id, sku, category'
    });
  }
}

export const db = new WireFlowDexie();
