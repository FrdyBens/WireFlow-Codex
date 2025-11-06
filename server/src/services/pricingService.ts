type PricingItem = {
  id: number;
  sku: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  vendor: string | null;
  category: string | null;
};

import Papa, { type ParseResult } from 'papaparse';
import { prisma } from '../db/prisma.js';

export async function listPricing(): Promise<PricingItem[]> {
  return prisma.pricingItem.findMany({ orderBy: { name: 'asc' } });
}

export async function importPricingCsv(csvContent: string): Promise<PricingItem[]> {
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true
  });

  if (parsed.errors.length) {
    throw new Error(parsed.errors.map((error) => error.message).join(', '));
  }

  const records = (parsed.data as ParseResult<PricingItem>['data']).map((row) => ({
    sku: String(row['sku'] ?? ''),
    name: String(row['name'] ?? ''),
    description: String(row['description'] ?? ''),
    unit: String(row['unit'] ?? ''),
    price: Number(row['price'] ?? 0),
    vendor: row['vendor'] ? String(row['vendor']) : null,
    category: row['category'] ? String(row['category']) : null
  }));

  await prisma.$transaction([
    prisma.pricingItem.deleteMany(),
    prisma.pricingItem.createMany({ data: records })
  ]);

  return listPricing();
}
