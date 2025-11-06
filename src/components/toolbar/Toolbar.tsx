import React from 'react';
import styled from '@emotion/styled';
import { useProjectStore } from '../../state/useProjectStore';
import type { ToolSelection } from '../../state/useProjectStore';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToolButton = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? '#2563eb' : 'rgba(255, 255, 255, 0.08)')};
  color: ${({ active }) => (active ? '#ffffff' : '#f9fafb')};
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? '#1d4ed8' : 'rgba(255, 255, 255, 0.16)')};
  }
`;

const tools: { id: ToolSelection; label: string }[] = [
  { id: 'wall', label: 'Wall' },
  { id: 'device:socket', label: 'Socket' },
  { id: 'device:light', label: 'Light' },
  { id: 'device:switch', label: 'Switch' }
];

export const Toolbar: React.FC = () => {
  const { selectedTool, setSelectedTool, refreshBom } = useProjectStore();

  return (
    <ToolbarContainer>
      {tools.map((tool) => (
        <ToolButton key={tool.id ?? tool.label} active={selectedTool === tool.id} onClick={() => setSelectedTool(tool.id)}>
          {tool.label}
        </ToolButton>
      ))}
      <ToolButton onClick={refreshBom}>Refresh BOM</ToolButton>
    </ToolbarContainer>
  );
};
