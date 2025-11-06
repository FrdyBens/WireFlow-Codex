interface VoltageDropInput {
  lengthMeters: number;
  currentAmps: number;
  conductorAreaMm2: number;
  resistivity: number;
  voltage: number;
}

export function calculateVoltageDrop({
  lengthMeters,
  currentAmps,
  conductorAreaMm2,
  resistivity,
  voltage
}: VoltageDropInput): number {
  if (conductorAreaMm2 === 0) return 0;
  const resistance = (resistivity * (lengthMeters * 2)) / conductorAreaMm2;
  const drop = currentAmps * resistance;
  return Number(((drop / voltage) * 100).toFixed(2));
}
