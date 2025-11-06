import { Device, RouteSegment, Wall } from '../../types';
import { runAStar } from './pathfinding';
import { buildMst } from './mst';
import { sizeConduitForCableBundle } from '../standards/conduit';

const PANEL_POSITION = { x: 80, y: 80 };

const enforceBendLimit = (points: { x: number; y: number }[]) => {
  const directionChanges = (pts: { x: number; y: number }[]) => {
    let changes = 0;
    for (let i = 2; i < pts.length; i++) {
      const prev = pts[i - 1];
      const prevPrev = pts[i - 2];
      const current = pts[i];
      const v1 = { x: prev.x - prevPrev.x, y: prev.y - prevPrev.y };
      const v2 = { x: current.x - prev.x, y: current.y - prev.y };
      if (v1.x * v2.y - v1.y * v2.x !== 0) {
        changes += 90;
      }
    }
    return changes;
  };

  let working = [...points];
  while (directionChanges(working) > 360 && working.length > 2) {
    // remove every second intermediate point to reduce bends
    working = working.filter((_, index) => index === 0 || index === working.length - 1 || index % 2 === 0);
  }
  return working;
};

export const autoRoute = (walls: Wall[], devices: Device[]): RouteSegment[] => {
  if (devices.length === 0) {
    return [];
  }

  const treeEdges = buildMst([{ id: 'panel', position: PANEL_POSITION }, ...devices]);
  const segments: RouteSegment[] = [];

  treeEdges.forEach(({ from, to }) => {
    const start = from === 'panel' ? PANEL_POSITION : devices.find((d) => d.id === from)!.position;
    const end = to === 'panel' ? PANEL_POSITION : devices.find((d) => d.id === to)!.position;

    const path = runAStar(start, end, walls);
    const limitedPath = enforceBendLimit(path);
    const points = limitedPath.flatMap((node) => [node.x, node.y]);
    const length = limitedPath.reduce((acc, node, index) => {
      if (index === 0) return acc;
      const prev = limitedPath[index - 1];
      return acc + Math.hypot(node.x - prev.x, node.y - prev.y);
    }, 0);

    const cableCount = to === 'panel' ? 3 : 2;
    const conduitSizeMM = sizeConduitForCableBundle(cableCount, 2.5);

    segments.push({
      id: `${from}-${to}`,
      deviceId: to === 'panel' ? from : to,
      circuitId: devices.find((d) => d.id === to)?.circuitId ?? devices.find((d) => d.id === from)?.circuitId ?? null,
      points,
      length,
      conduitSizeMM
    });
  });

  return segments;
};
