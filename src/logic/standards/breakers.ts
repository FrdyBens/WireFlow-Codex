interface BreakerOption {
  size: number;
  type: 'MCB' | 'RCBO';
  curve: 'B' | 'C';
  standard: 'IEC' | 'BS1363';
}

const BREAKER_LIBRARY: BreakerOption[] = [
  { size: 6, type: 'MCB', curve: 'B', standard: 'IEC' },
  { size: 10, type: 'MCB', curve: 'B', standard: 'IEC' },
  { size: 16, type: 'MCB', curve: 'B', standard: 'IEC' },
  { size: 20, type: 'MCB', curve: 'C', standard: 'IEC' },
  { size: 32, type: 'MCB', curve: 'C', standard: 'IEC' },
  { size: 40, type: 'RCBO', curve: 'C', standard: 'BS1363' }
];

export interface BreakerSelectionOptions {
  loadW: number;
  voltage: number;
  rulePreset?: 'IEC' | 'BS1363';
  allowRcbo?: boolean;
}

export const selectBreaker = (loadW: number, voltage: number, options?: Partial<BreakerSelectionOptions>) => {
  const current = voltage === 0 ? 0 : loadW / voltage;
  const preset = options?.rulePreset ?? 'IEC';
  const allowRcbo = options?.allowRcbo ?? true;

  const sorted = BREAKER_LIBRARY.filter((breaker) => breaker.standard === preset && (allowRcbo || breaker.type !== 'RCBO')).sort(
    (a, b) => a.size - b.size
  );
  const match = sorted.find((breaker) => breaker.size >= current);
  return match ?? sorted[sorted.length - 1];
};
