import { Circuit, Device } from '../../types/project';

export interface CableSpecification {
  crossSectionMm2: number;
  material: 'copper' | 'aluminium';
  insulation: 'PVC' | 'XLPE';
  phaseCount: 1 | 3;
  temperatureRating: number;
}

export interface VoltageDropResult {
  dropVolts: number;
  dropPercent: number;
  withinLimit: boolean;
}

export function calculateVoltageDrop(
  lengthMeters: number,
  loadVA: number,
  supplyVoltage: number,
  cable: CableSpecification,
  limitPercent: number
): VoltageDropResult {
  const resistivityMap = {
    copper: 0.018,
    aluminium: 0.029
  } as const;
  const resistance = (resistivityMap[cable.material] * lengthMeters) / cable.crossSectionMm2;
  const current = loadVA / supplyVoltage;
  const dropVolts = current * resistance * (cable.phaseCount === 3 ? Math.sqrt(3) : 2);
  const dropPercent = (dropVolts / supplyVoltage) * 100;
  return {
    dropVolts,
    dropPercent,
    withinLimit: dropPercent <= limitPercent
  };
}

export interface BreakerSelection {
  rating: number;
  type: Circuit['breakerType'];
  reason: string;
}

export function selectBreaker(
  loadVA: number,
  supplyVoltage: number,
  preset: Circuit['rulePreset']
): BreakerSelection {
  const baseCurrent = loadVA / supplyVoltage;
  const safetyFactor = preset === 'BS1363' ? 1.45 : 1.25;
  const requiredRating = Math.ceil(baseCurrent * safetyFactor);
  const standardRatings = [6, 10, 16, 20, 25, 32, 40, 50, 63];
  const rating = standardRatings.find((r) => r >= requiredRating) ?? standardRatings[standardRatings.length - 1];
  const reason = `Load ${loadVA.toFixed(0)}VA @ ${supplyVoltage}V => ${baseCurrent.toFixed(1)}A, safety factor ${safetyFactor}`;
  return { rating, type: 'MCB', reason };
}

export interface ConduitSizingInput {
  conductorAreasMm2: number[];
  conduitInnerDiameterMm: number;
  bendCount: number;
}

export interface ConduitSizingResult {
  fillPercent: number;
  maxFillPercent: number;
  withinFillLimit: boolean;
  withinBendLimit: boolean;
}

export function sizeConduitForCableBundle({
  conductorAreasMm2,
  conduitInnerDiameterMm,
  bendCount
}: ConduitSizingInput): ConduitSizingResult {
  const conduitArea = Math.PI * (conduitInnerDiameterMm / 2) ** 2;
  const cableArea = conductorAreasMm2.reduce((sum, area) => sum + area, 0) * 1.2; // 20% extra for insulation
  const fillPercent = (cableArea / conduitArea) * 100;
  const maxFillPercent = 40;
  const withinFillLimit = fillPercent <= maxFillPercent;
  const withinBendLimit = bendCount * 90 <= 360;
  return { fillPercent, maxFillPercent, withinFillLimit, withinBendLimit };
}

export function computeCircuitLoad(devices: Device[]): number {
  return devices.reduce((total, device) => total + (device.loadVA ?? 0), 0);
}
