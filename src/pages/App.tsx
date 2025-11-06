import React from 'react';
import CanvasStage from '../components/canvas/CanvasStage';
import Toolbar from '../components/toolbar/Toolbar';
import InspectorPanel from '../components/inspector/InspectorPanel';
import CircuitManager from '../components/sidebar/CircuitManager';
import { useProjectStore } from '../state/useProjectStore';
import { ProjectData } from '../types/project';
import { sampleProject } from '../sampleProject';

export const App: React.FC = () => {
  const { project, setProject } = useProjectStore();

  React.useEffect(() => {
    if (project.devices.length === 0 && project.walls.length === 0) {
      setProject(sampleProject as ProjectData);
    }
  }, [project, setProject]);

  return (
    <div className="app-shell">
      <Toolbar />
      <aside className="sidebar">
        <div className="section">
          <h2>Project</h2>
          <div>{project.name}</div>
          <p>{project.description || 'No description'}</p>
        </div>
        <CircuitManager />
      </aside>
      <CanvasStage width={1200} height={800} />
      <InspectorPanel />
    </div>
  );
};

export default App;
