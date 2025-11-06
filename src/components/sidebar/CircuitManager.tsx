import React from 'react';
import { nanoid } from 'nanoid';
import { useProjectStore } from '../../state/useProjectStore';
import { Circuit } from '../../types/project';

export const CircuitManager: React.FC = () => {
  const { project, updateCircuits, updatePanels } = useProjectStore();
  const [circuitName, setCircuitName] = React.useState('');
  const [panelName, setPanelName] = React.useState('');

  const handleAddPanel = () => {
    if (!panelName.trim()) return;
    const newPanel = {
      id: nanoid(),
      name: panelName,
      mainBreakerRating: 63,
      supplyVoltage: 230
    };
    updatePanels([...project.panels, newPanel]);
    setPanelName('');
  };

  const handleAddCircuit = () => {
    if (!circuitName.trim() || project.panels.length === 0) return;
    const panelId = project.panels[0].id;
    const newCircuit: Circuit = {
      id: nanoid(),
      name: circuitName,
      panelId,
      breakerType: 'MCB',
      breakerRating: 16,
      maxLoadVA: 3000,
      voltageDropLimit: 3,
      rulePreset: 'IEC'
    };
    updateCircuits([...project.circuits, newCircuit]);
    setCircuitName('');
  };

  return (
    <div className="section">
      <h2>Panels & Circuits</h2>
      <div className="form-group">
        <label>New Panel</label>
        <input value={panelName} onChange={(event) => setPanelName(event.target.value)} placeholder="Panel name" />
        <button className="button" type="button" onClick={handleAddPanel}>
          Add Panel
        </button>
      </div>
      <div className="form-group">
        <label>New Circuit</label>
        <input value={circuitName} onChange={(event) => setCircuitName(event.target.value)} placeholder="Circuit name" />
        <button className="button" type="button" onClick={handleAddCircuit} disabled={project.panels.length === 0}>
          Add Circuit
        </button>
      </div>
      <ul>
        {project.circuits.map((circuit) => (
          <li key={circuit.id}>
            {circuit.name} → {project.panels.find((panel) => panel.id === circuit.panelId)?.name ?? 'Unknown'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CircuitManager;
