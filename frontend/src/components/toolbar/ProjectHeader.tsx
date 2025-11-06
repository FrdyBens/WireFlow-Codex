import { css } from '@emotion/react';
import { useProjectStore } from '../../state/useProjectStore';

const headerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const inputStyle = css`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 14px;
`;

const buttonStyle = css`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #1565c0;
  color: white;
  font-weight: 600;
`;

function ProjectHeader() {
  const projectName = useProjectStore((state) => state.projectName);
  const renameProject = useProjectStore((state) => state.renameProject);
  const runRouting = useProjectStore((state) => state.runRouting);

  return (
    <header css={headerStyle}>
      <input
        css={inputStyle}
        value={projectName}
        onChange={(event) => renameProject(event.target.value)}
        placeholder="Project Name"
      />
      <button css={buttonStyle} onClick={() => runRouting()}>
        Auto-route & Update BOM
      </button>
    </header>
  );
}

export default ProjectHeader;
