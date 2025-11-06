import React from 'react';
import { useProjectStore } from '../../state/useProjectStore';
import ExportActions from './ExportActions';

export const InspectorPanel: React.FC = () => {
  const { project, bom } = useProjectStore();

  return (
    <aside className="inspector">
      <div className="section">
        <h2>Circuits</h2>
        {project.circuits.map((circuit) => (
          <div key={circuit.id} className="inspector-card">
            <strong>{circuit.name}</strong>
            <div>Breaker: {circuit.breakerRating}A {circuit.breakerType}</div>
            <div>Preset: {circuit.rulePreset}</div>
            <div>Voltage Drop Limit: {circuit.voltageDropLimit}%</div>
          </div>
        ))}
      </div>
      <div className="section">
        <h2>BOM Summary</h2>
        <div>Total Cost: {bom?.totalCost ? `£${bom.totalCost.toFixed(2)}` : 'N/A'}</div>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {bom?.items.map((item) => (
              <tr key={`${item.name}-${item.sku ?? 'no-sku'}`}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.total ? `£${item.total.toFixed(2)}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section">
        <h2>Warnings</h2>
        {bom?.warnings.length ? (
          <ul>
            {bom.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        ) : (
          <p>No warnings</p>
        )}
      </div>
      <ExportActions />
    </aside>
  );
};

export default InspectorPanel;
