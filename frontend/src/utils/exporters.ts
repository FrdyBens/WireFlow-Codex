import { jsPDF } from 'jspdf';
import type { BomSummary } from '../logic/costing/bom';
import type { ProjectState } from '../state/useProjectStore';

export function exportBomToCsv(bom: BomSummary) {
  const header = 'name,quantity,unit,unitPrice,total,category';
  const rows = bom.items.map((item) =>
    [item.name, item.quantity, item.unit, item.unitPrice, item.total, item.category]
      .map((value) => `"${value}"`)
      .join(',')
  );
  const csv = [header, ...rows, `Total,,,,${bom.totalCost},`].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bom.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function exportProjectSummaryPdf(state: ProjectState) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('WireFlow Project Summary', 14, 20);
  doc.setFontSize(12);
  doc.text(`Project: ${state.projectName}`, 14, 32);
  doc.text(`Circuits: ${state.circuits.length}`, 14, 40);
  doc.text(`Devices: ${state.devices.length}`, 14, 48);
  doc.text(`Total BOM cost: ${state.bom.totalCost.toFixed(2)}`, 14, 56);
  let y = 68;
  state.circuits.forEach((circuit) => {
    doc.text(`${circuit.name} - ${circuit.breakerType} ${circuit.breakerRating}A`, 14, y);
    y += 6;
    doc.text(`Length: ${circuit.length.toFixed(1)}m | Voltage drop: ${circuit.voltageDrop}%`, 18, y);
    y += 8;
  });
  doc.save('project-summary.pdf');
}

export function exportProjectJson(state: ProjectState) {
  const payload = JSON.stringify(
    {
      projectName: state.projectName,
      walls: state.walls,
      devices: state.devices,
      circuits: state.circuits,
      panels: state.panels
    },
    null,
    2
  );
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'project.json';
  link.click();
  URL.revokeObjectURL(url);
}
