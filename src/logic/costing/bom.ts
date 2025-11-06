import { BomItem, Circuit, Device, PricingItem, RouteSegment } from '../../types';
import { estimateSlack } from '../standards/estimation';

export interface BomResult {
  items: BomItem[];
  totalCost: number;
}

const lookupPrice = (pricing: PricingItem[], name: string) => pricing.find((item) => item.name === name);

export const generateBom = (
  devices: Device[],
  routes: RouteSegment[],
  circuits: Circuit[],
  pricing: PricingItem[]
): BomResult => {
  const items: BomItem[] = [];

  const totalCable = routes.reduce((acc, segment) => acc + segment.length + estimateSlack(segment.length), 0);
  const cableItem = lookupPrice(pricing, 'T&E Cable 2C 2.5mm2');
  items.push({
    id: 'cable-main',
    name: 'Twin & Earth Cable 2.5mm²',
    unit: 'meter',
    quantity: totalCable,
    unitPrice: cableItem?.price,
    totalPrice: cableItem ? cableItem.price * totalCable : undefined,
    category: 'Cables'
  });

  const conduitItem = lookupPrice(pricing, 'PVC Conduit 20mm');
  items.push({
    id: 'conduit',
    name: 'PVC Conduit 20mm',
    unit: 'length',
    quantity: totalCable * 1.05,
    unitPrice: conduitItem?.price,
    totalPrice: conduitItem ? conduitItem.price * totalCable * 1.05 : undefined,
    category: 'Conduit'
  });

  devices.forEach((device) => {
    const price = pricing.find((item) => item.name.toLowerCase().includes(device.type.replace('_', ' ')));
    items.push({
      id: `device-${device.id}`,
      name: device.type,
      unit: 'each',
      quantity: 1,
      unitPrice: price?.price,
      totalPrice: price?.price,
      category: 'Devices',
      circuitId: device.circuitId
    });
  });

  circuits.forEach((circuit) => {
    const breaker = lookupPrice(pricing, circuit.breakerSizeA === 32 ? 'MCB 32A' : 'MCB 10A');
    items.push({
      id: `breaker-${circuit.id}`,
      name: `${circuit.breakerType} ${circuit.breakerSizeA}A`,
      unit: 'each',
      quantity: 1,
      unitPrice: breaker?.price,
      totalPrice: breaker?.price,
      category: 'Breakers',
      circuitId: circuit.id
    });
  });

  const totalCost = items.reduce((acc, item) => acc + (item.totalPrice ?? 0), 0);

  return { items, totalCost };
};
