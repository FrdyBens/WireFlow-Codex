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

import { prisma } from '../db/prisma.js';

interface RoutingSegment {
  length: number;
  conduit: string;
}

interface Device {
  type: string;
}

interface BomItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category: string;
}

interface BomResponse {
  items: BomItem[];
  totalCost: number;
  byCategory: Record<string, number>;
}

function findPricing(pricing: PricingItem[], identifier: string) {
  const lowered = identifier.toLowerCase();
  return pricing.find((item) => item.name.toLowerCase() === lowered || item.sku.toLowerCase() === lowered);
}

export async function generateBomEstimate(segments: RoutingSegment[], devices: Device[]): Promise<BomResponse> {
  const pricing = await prisma.pricingItem.findMany();
  const cableLength = segments.reduce((sum, segment) => sum + segment.length, 0);
  const conduitLength = segments.reduce((sum, segment) => sum + segment.length, 0);
  const deviceCounts = devices.reduce<Record<string, number>>((acc, device) => {
    acc[device.type] = (acc[device.type] ?? 0) + 1;
    return acc;
  }, {});

  const items: BomItem[] = [];

  if (cableLength > 0) {
    const match = findPricing(pricing, 'PVC Twin & Earth 2.5mm²');
    const unitPrice = match?.price ?? 2.5;
    items.push({
      name: 'Cable length',
      quantity: Number(cableLength.toFixed(1)),
      unit: 'm',
      unitPrice,
      total: Number((unitPrice * cableLength).toFixed(2)),
      category: 'Cabling'
    });
  }

  if (conduitLength > 0) {
    const match = findPricing(pricing, 'PVC Conduit 20mm');
    const unitPrice = match?.price ?? 1.25;
    items.push({
      name: 'Conduit length',
      quantity: Number(conduitLength.toFixed(1)),
      unit: 'm',
      unitPrice,
      total: Number((unitPrice * conduitLength).toFixed(2)),
      category: 'Containment'
    });
  }

  Object.entries(deviceCounts).forEach(([type, quantity]) => {
    const match = findPricing(pricing, type);
    const unitPrice = match?.price ?? 10;
    items.push({
      name: `${type} device`,
      quantity,
      unit: 'ea',
      unitPrice,
      total: Number((unitPrice * quantity).toFixed(2)),
      category: 'Devices'
    });
  });

  const byCategory = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.total;
    return acc;
  }, {});

  const totalCost = items.reduce((sum, item) => sum + item.total, 0);

  return { items, totalCost, byCategory };
}
