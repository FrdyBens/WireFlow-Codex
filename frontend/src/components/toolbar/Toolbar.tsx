import { css } from '@emotion/react';
import { useMemo, useState } from 'react';
import { useProjectStore, DeviceType } from '../../state/useProjectStore';

const sectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const toolButtonStyle = (active: boolean) => css`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${active ? '#1565c0' : 'rgba(0, 0, 0, 0.15)'};
  background: ${active ? 'rgba(21, 101, 192, 0.12)' : 'white'};
  cursor: pointer;
  font-size: 13px;
  text-align: left;
`;

const selectStyle = css`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 13px;
`;

const inputStyle = css`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 13px;
`;

const buttonStyle = css`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #1565c0;
  color: white;
  cursor: pointer;
  font-weight: 600;
`;

interface ToolbarProps {
  onSelectTab: (tab: 'inspector' | 'bom') => void;
  activeTab: 'inspector' | 'bom';
}

const TOOL_DEFINITIONS: { label: string; value: DeviceType | 'wall' | 'select' }[] = [
  { label: 'Select / Move', value: 'select' },
  { label: 'Draw Wall', value: 'wall' },
  { label: 'Socket', value: 'socket' },
  { label: 'Light', value: 'light' },
  { label: 'Switch', value: 'switch' },
  { label: 'Water Heater', value: 'water-heater' },
  { label: 'Cooker', value: 'cooker' },
  { label: 'Air Conditioner', value: 'ac' },
  { label: 'Data / CCTV', value: 'data' }
];

function Toolbar({ onSelectTab, activeTab }: ToolbarProps) {
  const activeTool = useProjectStore((state) => state.activeTool);
  const setActiveTool = useProjectStore((state) => state.setActiveTool);
  const panels = useProjectStore((state) => state.panels);
  const addCircuit = useProjectStore((state) => state.addCircuit);
  const [panelId, setPanelId] = useState<string>(panels[0]?.id ?? '');
  const [circuitName, setCircuitName] = useState('Lighting');
  const [breakerType, setBreakerType] = useState<'MCB' | 'RCCB' | 'RCBO'>('MCB');

  const tabButtonStyle = (tab: 'inspector' | 'bom') =>
    css`
      padding: 8px 12px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      background: ${activeTab === tab ? '#1565c0' : 'rgba(0, 0, 0, 0.07)'};
      color: ${activeTab === tab ? 'white' : '#1a1c1f'};
      cursor: pointer;
    `;

  const panelOptions = useMemo(
    () => panels.map((panel) => ({ value: panel.id, label: panel.name })),
    [panels]
  );

  return (
    <div>
      <section css={sectionStyle}>
        <span>Tools</span>
        {TOOL_DEFINITIONS.map((tool) => (
          <button
            type="button"
            key={tool.value}
            css={toolButtonStyle(activeTool === tool.value)}
            onClick={() => setActiveTool(tool.value as typeof activeTool)}
          >
            {tool.label}
          </button>
        ))}
      </section>
      <section css={sectionStyle}>
        <span>Circuits</span>
        <select css={selectStyle} value={panelId} onChange={(event) => setPanelId(event.target.value)}>
          {panelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          css={inputStyle}
          value={circuitName}
          onChange={(event) => setCircuitName(event.target.value)}
          placeholder="Circuit name"
        />
        <select css={selectStyle} value={breakerType} onChange={(event) => setBreakerType(event.target.value as typeof breakerType)}>
          <option value="MCB">MCB</option>
          <option value="RCCB">RCCB</option>
          <option value="RCBO">RCBO</option>
        </select>
        <button
          css={buttonStyle}
          onClick={() => {
            if (!panelId) return;
            addCircuit(panelId, circuitName || 'New Circuit', breakerType);
          }}
        >
          Add circuit
        </button>
      </section>
      <section css={sectionStyle}>
        <span>Panels & BOM</span>
        <button css={tabButtonStyle('inspector')} onClick={() => onSelectTab('inspector')}>
          Inspector
        </button>
        <button css={tabButtonStyle('bom')} onClick={() => onSelectTab('bom')}>
          BOM & Costs
        </button>
      </section>
    </div>
  );
}

export default Toolbar;
