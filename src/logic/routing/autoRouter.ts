import { nanoid } from 'nanoid';
import { Circuit, Device, ProjectData, RoutingSegment } from '../../types/project';
import { estimateSlack } from '../costing/estimators';

interface GridNode {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  parent?: GridNode;
}

const GRID_SIZE = 50;

export function autoRouteProject(project: ProjectData, slackFn = estimateSlack): ProjectData {
  const segments: RoutingSegment[] = [];
  project.circuits.forEach((circuit) => {
    const devices = project.devices.filter((device) => device.circuitId === circuit.id);
    const panel = project.panels.find((p) => p.id === circuit.panelId);
    if (!panel) return;
    devices.forEach((device) => {
      const path = findPath(device, panel);
      const length = computePathLength(path);
      const slack = slackFn({ length });
      segments.push({
        id: nanoid(),
        type: 'cable',
        circuitId: circuit.id,
        path,
        length,
        slack,
        conductorCount: 3
      });
    });
  });
  return {
    ...project,
    routing: { segments }
  };
}

function findPath(device: Device, panel: { position?: { x: number; y: number } }): { x: number; y: number }[] {
  const start = snapToGrid(device.position);
  const goal = snapToGrid(panel.position ?? { x: 0, y: 0 });
  const open: GridNode[] = [createNode(start.x, start.y, null, goal)];
  const closed = new Set<string>();

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const key = `${current.x},${current.y}`;
    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(current).map((node) => ({ x: node.x, y: node.y }));
    }
    closed.add(key);
    getNeighbors(current).forEach((neighbor) => {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (closed.has(neighborKey)) return;
      const gScore = current.g + GRID_SIZE;
      const hScore = manhattanDistance(neighbor, goal);
      const existing = open.find((node) => node.x === neighbor.x && node.y === neighbor.y);
      if (existing && gScore >= existing.g) return;
      const newNode = createNode(neighbor.x, neighbor.y, current, goal);
      newNode.g = gScore;
      newNode.h = hScore;
      newNode.f = gScore + hScore;
      if (!existing) {
        open.push(newNode);
      } else {
        existing.parent = current;
        existing.g = gScore;
        existing.h = hScore;
        existing.f = gScore + hScore;
      }
    });
  }
  return [device.position, goal];
}

function snapToGrid(position: { x: number; y: number }) {
  return {
    x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
  };
}

function createNode(x: number, y: number, parent: GridNode | null, goal: { x: number; y: number }): GridNode {
  const node: GridNode = { x, y, f: 0, g: 0, h: manhattanDistance({ x, y }, goal) };
  if (parent) {
    node.parent = parent;
    node.g = parent.g + GRID_SIZE;
    node.f = node.g + node.h;
  }
  return node;
}

function getNeighbors(node: GridNode): { x: number; y: number }[] {
  return [
    { x: node.x + GRID_SIZE, y: node.y },
    { x: node.x - GRID_SIZE, y: node.y },
    { x: node.x, y: node.y + GRID_SIZE },
    { x: node.x, y: node.y - GRID_SIZE }
  ];
}

function manhattanDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(node: GridNode): GridNode[] {
  const path: GridNode[] = [];
  let current: GridNode | undefined = node;
  while (current) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function computePathLength(path: { x: number; y: number }[]): number {
  if (path.length < 2) return 0;
  let length = 0;
  for (let i = 1; i < path.length; i += 1) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}
