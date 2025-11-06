export interface VoltageDropInput {
  loadW: number;
  circuitVoltage: number;
  lengthM: number;
  conductorResistance: number;
  conductorReactance: number;
}

export interface VoltageDropResult {
  volts: number;
  percentage: number;
}

export const calculateVoltageDrop = ({
  loadW,
  circuitVoltage,
  lengthM,
  conductorResistance,
  conductorReactance
}: VoltageDropInput): VoltageDropResult => {
  if (lengthM === 0 || circuitVoltage === 0) {
    return { volts: 0, percentage: 0 };
  }
  const current = loadW / circuitVoltage;
  const dropVolts = (conductorResistance * Math.cos(Math.PI / 6) + conductorReactance * Math.sin(Math.PI / 6)) * current * lengthM;
  const percentage = (dropVolts / circuitVoltage) * 100;
  return { volts: dropVolts, percentage };
};
