import { css } from '@emotion/react';
import { useState } from 'react';
import CanvasStage from '../components/canvas/CanvasStage';
import Toolbar from '../components/toolbar/Toolbar';
import InspectorPanel from '../components/inspector/InspectorPanel';
import BomTable from '../components/inspector/BomTable';
import ProjectHeader from '../components/toolbar/ProjectHeader';
import PricingUploader from '../components/inspector/PricingUploader';
import ExportPanel from '../components/inspector/ExportPanel';

const layoutStyle = css`
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
`;

const panelStyle = css`
  background: rgba(255, 255, 255, 0.92);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  padding: 16px;
  overflow-y: auto;
`;

const rightPanelStyle = css`
  background: rgba(255, 255, 255, 0.96);
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  padding: 16px;
  overflow-y: auto;
  display: grid;
  grid-template-rows: min-content 1fr;
  gap: 16px;
`;

const contentStyle = css`
  position: relative;
  background: #eef2f8;
`;

function App() {
  const [activeTab, setActiveTab] = useState<'inspector' | 'bom'>('inspector');

  return (
    <div css={layoutStyle}>
      <aside css={panelStyle}>
        <ProjectHeader />
        <Toolbar onSelectTab={setActiveTab} activeTab={activeTab} />
      </aside>
      <main css={contentStyle}>
        <CanvasStage />
      </main>
      <aside css={rightPanelStyle}>
        {activeTab === 'inspector' ? <InspectorPanel /> : <BomTable />}
        <PricingUploader />
        <ExportPanel />
      </aside>
    </div>
  );
}

export default App;
