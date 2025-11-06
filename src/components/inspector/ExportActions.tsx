import React from 'react';
import { useProjectStore } from '../../state/useProjectStore';
import { exportBomCsv, exportProjectPdf } from '../../logic/export/exporters';

export const ExportActions: React.FC = () => {
  const { project, bom } = useProjectStore();

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExportCsv = async () => {
    if (!bom) return;
    const blob = await exportBomCsv(bom);
    downloadBlob(blob, 'bom.csv');
  };

  const handleExportPdf = async () => {
    if (!bom) return;
    const blob = await exportProjectPdf(project, bom);
    downloadBlob(blob, 'summary.pdf');
  };

  return (
    <div className="section">
      <h2>Export</h2>
      <button className="button" type="button" onClick={handleExportPdf} disabled={!bom}>
        Download PDF
      </button>
      <button className="button secondary" type="button" onClick={handleExportCsv} disabled={!bom}>
        Download CSV
      </button>
    </div>
  );
};

export default ExportActions;
