import React, { useMemo } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import { useProjectStore } from '../../state/useProjectStore';
import { Device, Wall, RoutingSegment } from '../../types/project';

interface CanvasStageProps {
  width: number;
  height: number;
  onCanvasClick?: (point: { x: number; y: number }) => void;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({ width, height, onCanvasClick }) => {
  const { project } = useProjectStore();
  const deviceColorMap: Record<Device['type'], string> = useMemo(
    () => ({
      socket: '#60a5fa',
      light: '#f97316',
      switch: '#10b981',
      water_heater: '#facc15',
      cooker: '#ec4899',
      ac: '#22d3ee',
      data: '#a855f7',
      distribution_board: '#f43f5e'
    }),
    []
  );

  const handleClick = (event: any) => {
    if (!onCanvasClick) return;
    const stage = event.target.getStage();
    const pointer = stage.getPointerPosition();
    if (pointer) {
      onCanvasClick(pointer);
    }
  };

  return (
    <div className="canvas-area">
      <Stage width={width} height={height} onClick={handleClick} className="canvas-stage">
        <Layer>{project.walls.map((wall) => renderWall(wall))}</Layer>
        <Layer>{project.devices.map((device) => renderDevice(device, deviceColorMap))}</Layer>
        <Layer>{project.routing.segments.map((segment) => renderRoute(segment))}</Layer>
      </Stage>
    </div>
  );
};

function renderWall(wall: Wall) {
  const points = wall.points.flatMap(([x, y]) => [x, y]);
  return <Line key={wall.id} points={points} stroke="#111827" strokeWidth={wall.thickness} closed />;
}

function renderDevice(device: Device, colorMap: Record<Device['type'], string>) {
  const color = colorMap[device.type] ?? '#1f2937';
  return (
    <Circle
      key={device.id}
      x={device.position.x}
      y={device.position.y}
      radius={12}
      fill={color}
      stroke="#1f2937"
      strokeWidth={2}
      listening={false}
    />
  );
}

function renderRoute(segment: RoutingSegment) {
  const points = segment.path.flatMap((point) => [point.x, point.y]);
  return <Line key={segment.id} points={points} stroke="#ef4444" strokeWidth={4} dash={[12, 6]} />;
}

export default CanvasStage;
