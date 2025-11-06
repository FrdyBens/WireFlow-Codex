interface ConduitSizingInput {
  cableCount: number;
  conductorAreaMm2: number;
  insulationType: 'PVC' | 'XLPE';
}

const CONDUIT_SIZES = [
  { name: '16mm PVC conduit', area: 125 },
  { name: '20mm PVC conduit', area: 201 },
  { name: '25mm PVC conduit', area: 314 },
  { name: '32mm PVC conduit', area: 502 }
];

export function sizeConduitForCableBundle({ cableCount, conductorAreaMm2, insulationType }: ConduitSizingInput): string {
  const derating = insulationType === 'XLPE' ? 0.9 : 1;
  const cableArea = conductorAreaMm2 * 1.6;
  const totalArea = cableArea * cableCount;
  const requiredArea = (totalArea / derating) * 1.4; // 40% fill rule
  const match = CONDUIT_SIZES.find((size) => size.area >= requiredArea);
  return match?.name ?? CONDUIT_SIZES[CONDUIT_SIZES.length - 1].name;
}
