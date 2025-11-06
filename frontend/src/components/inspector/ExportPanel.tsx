import { css } from '@emotion/react';
import { exportBomToCsv, exportProjectJson, exportProjectSummaryPdf } from '../../utils/exporters';
import { useProjectStore } from '../../state/useProjectStore';

const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const buttonStyle = css`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #455a64;
  color: white;
  cursor: pointer;
  font-weight: 600;
`;

function ExportPanel() {
  const state = useProjectStore((project) => project);
  return (
    <div css={containerStyle}>
      <button css={buttonStyle} onClick={() => exportBomToCsv(state.bom)}>
        Export BOM CSV
      </button>
      <button css={buttonStyle} onClick={() => exportProjectSummaryPdf(state)}>
        Export Summary PDF
      </button>
      <button css={buttonStyle} onClick={() => exportProjectJson(state)}>
        Download Project JSON
      </button>
    </div>
  );
}

export default ExportPanel;
