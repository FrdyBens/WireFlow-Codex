import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { useProjectStore } from '../../state/useProjectStore';
import { selectBreaker } from '../../logic/standards/breakers';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
`;

const Label = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 0.9rem;
  color: #111827;
`;

export const InspectorPanel: React.FC = () => {
  const { selectedDeviceId, devices, circuits } = useProjectStore();
  const device = devices.find((d) => d.id === selectedDeviceId);
  const circuit = device ? circuits.find((c) => c.id === device.circuitId) : undefined;
  const recommendedBreaker = useMemo(() => {
    if (!circuit || !device) return null;
    const circuitDevices = devices.filter((d) => d.circuitId === circuit.id);
    const totalLoad = circuitDevices.reduce((acc, d) => acc + d.loadW, 0);
    return selectBreaker(totalLoad, circuit.voltage);
  }, [circuit, device, devices]);

  return (
    <Panel>
      <Section>
        <Label>Selected Device</Label>
        {device ? (
          <>
            <Value>Type: {device.type}</Value>
            <Value>Load: {device.loadW} W</Value>
            <Value>Circuit: {circuit?.name ?? 'Unassigned'}</Value>
            {recommendedBreaker && (
              <Value>
                Recommended Breaker: {recommendedBreaker.size}A {recommendedBreaker.type}
              </Value>
            )}
          </>
        ) : (
          <Value>No device selected</Value>
        )}
      </Section>
    </Panel>
  );
};
