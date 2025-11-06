import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { useProjectStore } from '../../state/useProjectStore';
import { selectBreaker } from '../../logic/standards/breakers';
import { calculateVoltageDrop } from '../../logic/standards/voltageDrop';

const Section = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const Header = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CircuitRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-of-type {
    border-bottom: none;
  }
`;

const Warning = styled.div`
  color: #b91c1c;
  font-size: 0.75rem;
`;

export const CircuitManager: React.FC = () => {
  const { circuits, routes, devices } = useProjectStore();
  const warnings = useMemo(() => {
    return circuits.flatMap((circuit) => {
      const circuitDevices = devices.filter((device) => device.circuitId === circuit.id);
      const totalLoad = circuitDevices.reduce((acc, device) => acc + device.loadW, 0);
      const recommendedBreaker = selectBreaker(totalLoad, circuit.voltage);
      const circuitRoutes = routes.filter((route) => route.circuitId === circuit.id);
      const totalLength = circuitRoutes.reduce((acc, segment) => acc + segment.length, 0);
      const voltageDrop = calculateVoltageDrop({
        loadW: totalLoad,
        circuitVoltage: circuit.voltage,
        lengthM: totalLength,
        conductorResistance: 0.018,
        conductorReactance: 0.007
      });

      const issues: string[] = [];
      if (totalLoad > circuit.maxLoadW) {
        issues.push('Circuit load exceeds allowed maximum.');
      }
      if (recommendedBreaker.size > circuit.breakerSizeA) {
        issues.push('Installed breaker is undersized.');
      }
      if (voltageDrop.percentage > 5) {
        issues.push('Voltage drop exceeds 5% limit.');
      }
      return issues.map((message) => ({ circuitId: circuit.id, message }));
    });
  }, [circuits, routes, devices]);

  return (
    <Section>
      <Header>Circuits</Header>
      {circuits.map((circuit) => (
        <CircuitRow key={circuit.id}>
          <div>
            <strong>{circuit.name}</strong> — {circuit.breakerSizeA}A {circuit.breakerType}
          </div>
          <div>
            Devices: {circuit.devices.length} | Max Load: {circuit.maxLoadW}W
          </div>
          {warnings
            .filter((warning) => warning.circuitId === circuit.id)
            .map((warning, index) => (
              <Warning key={index}>{warning.message}</Warning>
            ))}
        </CircuitRow>
      ))}
    </Section>
  );
};
