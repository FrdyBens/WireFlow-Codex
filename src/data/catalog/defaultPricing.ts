import { PricingItem } from '../../types';

export const defaultPricing: PricingItem[] = [
  {
    sku: 'CAB3C1.5',
    name: 'T&E Cable 3C 1.5mm2',
    description: 'Twin & Earth cable for lighting circuits',
    unit: 'meter',
    price: 1.2,
    vendor: 'CableCo',
    category: 'Cables'
  },
  {
    sku: 'CAB2C2.5',
    name: 'T&E Cable 2C 2.5mm2',
    description: 'Twin & Earth cable for ring circuits',
    unit: 'meter',
    price: 1.5,
    vendor: 'CableCo',
    category: 'Cables'
  },
  {
    sku: 'CON20PVC',
    name: 'PVC Conduit 20mm',
    description: '20mm rigid PVC conduit',
    unit: 'length',
    price: 2.4,
    vendor: 'PipeWorld',
    category: 'Conduit'
  },
  {
    sku: 'TRUNK40X40',
    name: 'Trunking 40x40',
    description: 'Plastic trunking for surface runs',
    unit: 'length',
    price: 3.1,
    vendor: 'PipeWorld',
    category: 'Conduit'
  },
  {
    sku: 'BRKMCB10A',
    name: 'MCB 10A',
    description: 'Single pole miniature circuit breaker',
    unit: 'each',
    price: 8.5,
    vendor: 'Protectix',
    category: 'Breakers'
  },
  {
    sku: 'BRKMCB32A',
    name: 'MCB 32A',
    description: 'Single pole miniature circuit breaker',
    unit: 'each',
    price: 9.5,
    vendor: 'Protectix',
    category: 'Breakers'
  }
];
