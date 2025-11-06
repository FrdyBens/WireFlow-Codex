import { nanoid } from 'nanoid';
import { estimateSlack } from './slack';
import type { RoutingInput, RoutingSegment } from './types';

interface ProjectLike extends RoutingInput {
  walls: { id: string; points: number[] }[];
}

const DEFAULT_PANEL_COORDS: Record<string, { x: number; y: number }> = {};

function getPanelPosition(panelId: string, fallbackIndex: number): { x: number; y: number } {
  if (!DEFAULT_PANEL_COORDS[panelId]) {
    DEFAULT_PANEL_COORDS[panelId] = {
      x: 64 + fallbackIndex * 48,
      y: 64
    };
  }
  return DEFAULT_PANEL_COORDS[panelId];
}

function manhattanRoute(start: { x: number; y: number }, end: { x: number; y: number }): [number, number][] {
  const points: [number, number][] = [
    [start.x, start.y],
    [end.x, start.y],
    [end.x, end.y]
  ];
  return points;
}

function calculateLength(points: [number, number][]): number {
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    length += Math.hypot(x2 - x1, y2 - y1);
  }
  return length;
}

export function runAutoRouting(state: ProjectLike): RoutingSegment[] {
  const segments: RoutingSegment[] = [];
  state.circuits.forEach((circuit, index) => {
    const panelPosition = getPanelPosition(circuit.id, index);
    circuit.deviceIds.forEach((deviceId) => {
      const device = state.devices.find((d) => d.id === deviceId);
      if (!device) return;
      const points = manhattanRoute({ x: device.x, y: device.y }, panelPosition);
      const length = calculateLength(points);
      const slack = estimateSlack(length);
      segments.push({
        id: nanoid(),
        circuitId: circuit.id,
        points,
        length: length + slack,
        conduit: circuit.deviceIds.length > 3 ? '25mm PVC conduit' : '20mm PVC conduit'
      });
    });
  });
  return segments;
}
