interface BreakerSelectionInput {
  loadVA: number;
  voltage: number;
  breakerType: 'MCB' | 'RCCB' | 'RCBO';
}

const BREAKER_SIZES = [6, 10, 16, 20, 32, 40, 50, 63];

export function selectBreaker({ loadVA, voltage, breakerType }: BreakerSelectionInput): number {
  const current = loadVA / voltage;
  const multiplier = breakerType === 'MCB' ? 1.25 : 1.3;
  const target = current * multiplier;
  return BREAKER_SIZES.find((size) => size >= target) ?? BREAKER_SIZES[BREAKER_SIZES.length - 1];
}
