import { ProjectData } from '../../types/project';

export interface PricingEntry {
  sku: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  vendor: string;
  category: string;
}

export interface PricingCatalog {
  items: PricingEntry[];
  updatedAt: string;
  source: 'uploaded_csv' | 'default';
}

export interface PricingLookupResult {
  items: PricingEntry[];
}

export function lookupPrices(catalog: PricingCatalog, _project: ProjectData): PricingLookupResult {
  return { items: catalog.items };
}

export function parsePricingCsv(csvText: string): PricingCatalog {
  const [headerLine, ...rows] = csvText.trim().split(/\r?\n/);
  const headers = headerLine.split(',');
  const expected = ['sku', 'name', 'description', 'unit', 'price', 'vendor', 'category'];
  const missing = expected.filter((column) => !headers.includes(column));
  if (missing.length) {
    throw new Error(`Missing columns: ${missing.join(', ')}`);
  }
  const items = rows
    .filter((row) => row.trim().length > 0)
    .map((row) => {
      const values = row.split(',');
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header.trim()] = values[index]?.trim() ?? '';
      });
      return {
        sku: record.sku,
        name: record.name,
        description: record.description,
        unit: record.unit,
        price: Number(record.price ?? 0),
        vendor: record.vendor,
        category: record.category
      } as PricingEntry;
    });
  return {
    items,
    updatedAt: new Date().toISOString(),
    source: 'uploaded_csv'
  };
}
