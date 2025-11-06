import { Circuit, ProjectData } from '../../types/project';
import { PricingLookupResult } from './pricing';
import { calculateVoltageDrop, selectBreaker } from '../standards/electrical';

export interface BomItem {
  sku?: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  total?: number;
  category?: string;
  metadata?: Record<string, string | number>;
}

export interface BomSummary {
  circuits: CircuitSummary[];
  items: BomItem[];
  totalCost: number;
  warnings: string[];
}

export interface CircuitSummary {
  circuit: Circuit;
  totalCableLength: number;
  loadVA: number;
  voltageDropPercent: number;
  breaker: ReturnType<typeof selectBreaker>;
  warnings: string[];
}

export function buildBillOfMaterials(project: ProjectData, pricing: PricingLookupResult | null): BomSummary {
  const warnings: string[] = [];
  const items: BomItem[] = [];
  const circuitSummaries: CircuitSummary[] = project.circuits.map((circuit) => {
    const segments = project.routing.segments.filter((segment) => segment.circuitId === circuit.id);
    const totalCableLength = segments.reduce((sum, segment) => sum + segment.length + segment.slack, 0);
    const devices = project.devices.filter((device) => device.circuitId === circuit.id);
    const loadVA = devices.reduce((sum, device) => sum + (device.loadVA ?? 0), 0);
    const cableSpec = {
      crossSectionMm2: 2.5,
      material: 'copper' as const,
      insulation: 'PVC' as const,
      phaseCount: 1 as const,
      temperatureRating: 70
    };
    const voltageDrop = calculateVoltageDrop(
      totalCableLength,
      loadVA,
      project.panels.find((p) => p.id === circuit.panelId)?.supplyVoltage ?? 230,
      cableSpec,
      circuit.voltageDropLimit
    );
    if (!voltageDrop.withinLimit) {
      warnings.push(`Circuit ${circuit.name} exceeds voltage drop limit with ${voltageDrop.dropPercent.toFixed(2)}%.`);
    }
    const breaker = selectBreaker(loadVA, 230, circuit.rulePreset);
    const circuitWarnings = [] as string[];
    if (breaker.rating > circuit.breakerRating) {
      circuitWarnings.push('Configured breaker undersized for calculated load.');
    }
    return {
      circuit,
      totalCableLength,
      loadVA,
      voltageDropPercent: voltageDrop.dropPercent,
      breaker,
      warnings: circuitWarnings
    };
  });

  const cableItem: BomItem = {
    name: 'PVC Twin & Earth Cable',
    quantity: circuitSummaries.reduce((sum, summary) => sum + summary.totalCableLength, 0),
    unit: 'm',
    metadata: {
      circuits: project.circuits.length,
      routes: project.routing.segments.length
    }
  };
  augmentWithPricing(cableItem, pricing);
  items.push(cableItem);

  project.devices.forEach((device) => {
    const item: BomItem = {
      name: device.name,
      quantity: 1,
      unit: 'ea',
      metadata: { type: device.type }
    };
    augmentWithPricing(item, pricing);
    items.push(item);
  });

  project.circuits.forEach((circuit) => {
    const breakerItem: BomItem = {
      name: `${circuit.name} Breaker`,
      description: `${circuit.breakerType} ${circuit.breakerRating}A`,
      quantity: 1,
      unit: 'ea'
    };
    augmentWithPricing(breakerItem, pricing);
    items.push(breakerItem);
  });

  const totalCost = items.reduce((sum, item) => sum + (item.total ?? 0), 0);
  return {
    circuits: circuitSummaries,
    items,
    totalCost,
    warnings
  };
}

function augmentWithPricing(item: BomItem, pricing: PricingLookupResult | null) {
  if (!pricing) return;
  const match = pricing.items.find((entry) => entry.name.toLowerCase() === item.name.toLowerCase());
  if (!match) return;
  item.sku = match.sku;
  item.unitPrice = match.price;
  item.category = match.category;
  item.total = match.price * item.quantity;
  item.description = item.description ?? match.description;
}
