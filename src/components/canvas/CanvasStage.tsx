import React, { useCallback, useMemo } from 'react';
import { Stage, Layer, Line, Rect, Group, Text, Circle } from 'react-konva';
import { useProjectStore } from '../../state/useProjectStore';
import { RouteSegment } from '../../types';
import { autoRoute } from '../../logic/routing/autoRouter';
import { estimateSlack } from '../../logic/standards/estimation';

const GRID_SIZE = 24;

const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const CanvasStage: React.FC = () => {
  const { walls, devices, selectedTool, addWall, addDevice, setSelectedDevice, selectedDeviceId, updateRoutes } =
    useProjectStore();

  const handleStageClick = useCallback(
    (e: any) => {
      const stage = e.target.getStage();
      const pointerPosition = stage?.getPointerPosition();
      if (!pointerPosition) return;
      const snapped = {
        x: snapToGrid(pointerPosition.x),
        y: snapToGrid(pointerPosition.y)
      };

      if (selectedTool === 'wall') {
        addWall({
          id: `wall-${Date.now()}`,
          points: [snapped.x - GRID_SIZE, snapped.y, snapped.x + GRID_SIZE, snapped.y]
        });
      }

      if (selectedTool?.startsWith('device:')) {
        const deviceType = selectedTool.split(':')[1];
        addDevice({
          id: `device-${Date.now()}`,
          type: deviceType,
          position: snapped,
          circuitId: null
        });
      }
    },
    [addDevice, addWall, selectedTool]
  );

  const handleDeviceClick = useCallback(
    (deviceId: string) => () => {
      setSelectedDevice(deviceId);
    },
    [setSelectedDevice]
  );

  const renderedRoutes = useMemo(() => {
    const newRoutes = autoRoute(walls, devices);
    const withSlack = newRoutes.map((segment) => ({
      ...segment,
      length: segment.length + estimateSlack(segment.length)
    }));
    updateRoutes(withSlack);
    return withSlack;
  }, [walls, devices, updateRoutes]);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight - 120}
      onMouseDown={handleStageClick}
      style={{ background: '#ffffff', borderRadius: '8px' }}
    >
      <Layer>
        {/* Grid */}
        {Array.from({ length: Math.ceil(window.innerWidth / GRID_SIZE) }).map((_, i) => (
          <Line
            key={`v-${i}`}
            points={[i * GRID_SIZE, 0, i * GRID_SIZE, window.innerHeight]}
            stroke="#f0f3f7"
          />
        ))}
        {Array.from({ length: Math.ceil(window.innerHeight / GRID_SIZE) }).map((_, i) => (
          <Line
            key={`h-${i}`}
            points={[0, i * GRID_SIZE, window.innerWidth, i * GRID_SIZE]}
            stroke="#f0f3f7"
          />
        ))}

        {/* Walls */}
        {walls.map((wall) => (
          <Line key={wall.id} points={wall.points} stroke="#2f4858" strokeWidth={6} lineCap="round" />
        ))}

        {/* Devices */}
        {devices.map((device) => (
          <Group key={device.id} x={device.position.x} y={device.position.y} onClick={handleDeviceClick(device.id)}>
            <Rect
              x={-12}
              y={-12}
              width={24}
              height={24}
              fill={device.id === selectedDeviceId ? '#1f78ff' : '#ffbf69'}
              cornerRadius={6}
              shadowBlur={device.id === selectedDeviceId ? 12 : 0}
            />
            <Text text={device.type.toUpperCase()} fontSize={10} x={-24} y={16} width={48} align="center" />
          </Group>
        ))}

        {/* Routes */}
        {renderedRoutes.map((route: RouteSegment) => (
          <Group key={route.id}>
            <Line
              points={route.points}
              stroke="#1f78ff"
              strokeWidth={4}
              lineCap="round"
              dash={[12, 8]}
            />
            <Circle x={route.points[route.points.length - 2]} y={route.points[route.points.length - 1]} radius={4} fill="#1f78ff" />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
};
