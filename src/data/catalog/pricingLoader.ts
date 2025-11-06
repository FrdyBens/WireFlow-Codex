import Dexie from 'dexie';
import { parsePricingCsv, PricingCatalog } from '../../logic/costing/pricing';

class PricingDatabase extends Dexie {
  public catalogs!: Dexie.Table<PricingCatalog, string>;

  constructor() {
    super('pricing');
    this.version(1).stores({
      catalogs: '&source'
    });
  }
}

const db = new PricingDatabase();

export async function loadPricingFromFile(file: File): Promise<PricingCatalog> {
  const text = await file.text();
  const catalog = parsePricingCsv(text);
  await db.catalogs.put(catalog, catalog.source);
  return catalog;
}

export async function getCachedPricing(): Promise<PricingCatalog | undefined> {
  return db.catalogs.get('uploaded_csv');
}
