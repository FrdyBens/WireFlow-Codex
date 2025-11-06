import { useCallback, useState } from 'react';
import { Stage, Layer, Line, Circle, Text, Group } from 'react-konva';
import { useProjectStore, DeviceType } from '../../state/useProjectStore';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 720;

const DEVICE_COLORS: Record<DeviceType, string> = {
  socket: '#1565c0',
  light: '#f9a825',
  switch: '#6d4c41',
  'water-heater': '#f06292',
  cooker: '#ef6c00',
  ac: '#26c6da',
  data: '#9ccc65'
};

function CanvasStage() {
  const walls = useProjectStore((state) => state.walls);
  const devices = useProjectStore((state) => state.devices);
  const routes = useProjectStore((state) => state.routes);
  const addWall = useProjectStore((state) => state.addWall);
  const addDevice = useProjectStore((state) => state.addDevice);
  const activeTool = useProjectStore((state) => state.activeTool);

  const [wallDraft, setWallDraft] = useState<number[] | null>(null);

  const handleStageClick = useCallback(
    (event: any) => {
      const pointer = event.target.getStage().getPointerPosition();
      if (!pointer) return;
      const { x, y } = pointer;

      if (activeTool === 'wall') {
        if (!wallDraft) {
          setWallDraft([x, y]);
        } else {
          addWall([...wallDraft, x, y]);
          setWallDraft(null);
        }
        return;
      }

      if (activeTool !== 'select') {
        addDevice(activeTool as DeviceType, x, y);
      }
    },
    [activeTool, wallDraft, addWall, addDevice]
  );

  return (
    <Stage
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ background: '#ffffff', borderRadius: '16px', margin: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
      onMouseDown={handleStageClick}
    >
      <Layer>
        {walls.map((wall) => (
          <Line key={wall.id} points={wall.points} stroke="#263238" strokeWidth={4} lineCap="round" />
        ))}
        {wallDraft ? (
          <Line points={[...wallDraft]} stroke="#90a4ae" strokeWidth={2} dash={[8, 8]} />
        ) : null}
        {routes.map((route) => (
          <Line
            key={route.id}
            points={route.points.flat()}
            stroke="#26a69a"
            strokeWidth={2}
            dash={[12, 6]}
            lineCap="round"
          />
        ))}
        {devices.map((device) => (
          <Group key={device.id}>
            <Circle x={device.x} y={device.y} radius={8} fill={DEVICE_COLORS[device.type]} />
            <Text x={device.x + 10} y={device.y - 10} text={device.type} fontSize={12} fill="#37474f" />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}

export default CanvasStage;
