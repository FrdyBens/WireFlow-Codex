import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { CanvasStage } from '../components/canvas/CanvasStage';
import { Toolbar } from '../components/toolbar/Toolbar';
import { InspectorPanel } from '../components/inspector/InspectorPanel';
import { CircuitManager } from '../components/inspector/CircuitManager';
import { BomPanel } from '../components/inspector/BomPanel';
import { useProjectStore } from '../state/useProjectStore';
import { PricingUploader } from '../components/inspector/PricingUploader';

const AppWrapper = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr 360px;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'toolbar toolbar toolbar'
    'left canvas right';
  height: 100vh;
  background: #f5f6fa;
  color: #1f2933;
  font-family: 'Inter', sans-serif;
`;

const LeftPanel = styled.div`
  grid-area: left;
  padding: 1rem;
  overflow-y: auto;
  background: #ffffff;
  border-right: 1px solid #e1e4e8;
`;

const RightPanel = styled.div`
  grid-area: right;
  padding: 1rem;
  overflow-y: auto;
  background: #ffffff;
  border-left: 1px solid #e1e4e8;
`;

const CanvasPanel = styled.div`
  grid-area: canvas;
  background: #ecf0f3;
  padding: 0.5rem;
`;

const ToolbarWrapper = styled.div`
  grid-area: toolbar;
  background: #1f2933;
  color: #f5f6fa;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const App: React.FC = () => {
  const { loadProjectFromFile } = useProjectStore();

  return (
    <AppWrapper>
      <Global
        styles={css`
          body {
            margin: 0;
            background: #f5f6fa;
            color: #1f2933;
          }
          * {
            box-sizing: border-box;
          }
        `}
      />
      <ToolbarWrapper>
        <Toolbar />
      </ToolbarWrapper>
      <LeftPanel>
        <InspectorPanel />
        <CircuitManager />
      </LeftPanel>
      <CanvasPanel>
        <CanvasStage />
      </CanvasPanel>
      <RightPanel>
        <BomPanel />
        <PricingUploader onProjectUpload={loadProjectFromFile} />
      </RightPanel>
    </AppWrapper>
  );
};
