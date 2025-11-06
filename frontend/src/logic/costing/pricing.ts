import Papa, { type ParseResult } from 'papaparse';
import type { PricingRecord } from '../../utils/db';

const pricingCache = new Map<string, PricingRecord>();

export function seedPricing(records: PricingRecord[]): void {
  pricingCache.clear();
  records.forEach((record) => {
    pricingCache.set(record.sku ?? record.name, record);
    pricingCache.set(record.name.toLowerCase(), record);
    if (record.category) {
      pricingCache.set(`${record.category}:${record.name}`.toLowerCase(), record);
    }
  });
}

export function lookupPricing(name: string): PricingRecord | undefined {
  const key = name.toLowerCase();
  return pricingCache.get(key) ?? pricingCache.get(name) ?? pricingCache.get(`default:${key}`);
}

export async function parsePricingCsv(file: File): Promise<PricingRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transform: (value: string | undefined) => value?.trim?.(),
      complete: (results: ParseResult<PricingRecord>) => {
        try {
          const records = (results.data as ParseResult<PricingRecord>['data']).map((row) => ({
            sku: String(row['sku'] ?? ''),
            name: String(row['name'] ?? ''),
            description: String(row['description'] ?? ''),
            unit: String(row['unit'] ?? ''),
            price: Number(row['price'] ?? 0),
            vendor: row['vendor'] ? String(row['vendor']) : undefined,
            category: row['category'] ? String(row['category']) : undefined
          }));
          resolve(records);
        } catch (error) {
          reject(error);
        }
      },
      error: (error: Error) => reject(error)
    });
  });
}
