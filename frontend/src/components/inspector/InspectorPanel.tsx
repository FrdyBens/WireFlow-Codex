import { css } from '@emotion/react';
import { useMemo } from 'react';
import { useProjectStore } from '../../state/useProjectStore';

const sectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const cardStyle = css`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 12px;
  background: white;
`;

function InspectorPanel() {
  const circuits = useProjectStore((state) => state.circuits);
  const devices = useProjectStore((state) => state.devices);

  const enrichedCircuits = useMemo(
    () =>
      circuits.map((circuit) => {
        const circuitDevices = devices.filter((device) => device.circuitId === circuit.id);
        const loadVA = circuitDevices.reduce((sum, device) => sum + device.loadVA, 0);
        return {
          ...circuit,
          loadVA,
          deviceCount: circuitDevices.length
        };
      }),
    [circuits, devices]
  );

  return (
    <div css={sectionStyle}>
      {enrichedCircuits.length === 0 && <p>No circuits yet. Add one from the toolbar.</p>}
      {enrichedCircuits.map((circuit) => (
        <div key={circuit.id} css={cardStyle}>
          <h3>{circuit.name}</h3>
          <p>
            Breaker: {circuit.breakerType} {circuit.breakerRating}A | Devices: {circuit.deviceCount}
          </p>
          <p>Estimated load: {circuit.loadVA} VA</p>
          <p>Voltage drop: {circuit.voltageDrop}%</p>
          <p>Estimated length: {circuit.length.toFixed(1)} m</p>
        </div>
      ))}
    </div>
  );
}

export default InspectorPanel;
