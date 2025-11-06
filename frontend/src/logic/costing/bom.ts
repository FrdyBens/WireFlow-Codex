import type { Device } from '../../state/useProjectStore';
import type { RoutingSegment } from '../routing/types';
import { lookupPricing } from './pricing';

export interface BomItem {
  sku?: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category: string;
}

export interface BomSummary {
  items: BomItem[];
  totalCost: number;
  byCategory: Record<string, number>;
}

export function generateBom(segments: RoutingSegment[], devices: Device[]): BomSummary {
  const cableLength = segments.reduce((sum, segment) => sum + segment.length, 0);
  const conduitLength = segments.reduce((sum, segment) => sum + segment.length, 0);
  const deviceCounts = devices.reduce<Record<string, number>>((acc, device) => {
    acc[device.type] = (acc[device.type] ?? 0) + 1;
    return acc;
  }, {});

  const items: BomItem[] = [];

  if (cableLength > 0) {
    const cablePricing = lookupPricing('PVC Twin & Earth 2.5mm²');
    items.push({
      sku: cablePricing?.sku,
      name: 'Cable length',
      quantity: Number(cableLength.toFixed(1)),
      unit: 'm',
      unitPrice: cablePricing?.price ?? 2.5,
      total: Number((cableLength * (cablePricing?.price ?? 2.5)).toFixed(2)),
      category: 'Cabling'
    });
  }

  if (conduitLength > 0) {
    const conduitPricing = lookupPricing('PVC Conduit 20mm');
    items.push({
      sku: conduitPricing?.sku,
      name: 'Conduit length',
      quantity: Number(conduitLength.toFixed(1)),
      unit: 'm',
      unitPrice: conduitPricing?.price ?? 1.25,
      total: Number((conduitLength * (conduitPricing?.price ?? 1.25)).toFixed(2)),
      category: 'Containment'
    });
  }

  Object.entries(deviceCounts).forEach(([type, quantity]) => {
    const pricing = lookupPricing(type);
    items.push({
      sku: pricing?.sku,
      name: `${type} device`,
      quantity,
      unit: 'ea',
      unitPrice: pricing?.price ?? 8,
      total: Number(((pricing?.price ?? 8) * quantity).toFixed(2)),
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
