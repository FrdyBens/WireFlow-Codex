import Dexie, { Table } from 'dexie';
import { PricingItem } from '../../types';

class PricingDatabase extends Dexie {
  public items!: Table<PricingItem, string>;

  constructor() {
    super('pricing');
    this.version(1).stores({
      items: '&sku,name,price,category'
    });
  }

  async replaceAll(items: PricingItem[]) {
    await this.transaction('rw', this.items, async () => {
      await this.items.clear();
      await this.items.bulkAdd(items);
    });
  }
}

export const pricingDb = new PricingDatabase();
