import { Wall } from '../../types';

interface Node {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: Node;
}

const GRID = 24;

const key = (x: number, y: number) => `${x}:${y}`;

const heuristic = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getNeighbours = (node: Node) => {
  const neighbours = [
    { x: node.x + GRID, y: node.y },
    { x: node.x - GRID, y: node.y },
    { x: node.x, y: node.y + GRID },
    { x: node.x, y: node.y - GRID }
  ];
  return neighbours;
};

const isBlocked = (x: number, y: number, walls: Wall[]) => {
  return walls.some((wall) => {
    for (let i = 0; i < wall.points.length - 3; i += 2) {
      const x1 = wall.points[i];
      const y1 = wall.points[i + 1];
      const x2 = wall.points[i + 2];
      const y2 = wall.points[i + 3];
      const minX = Math.min(x1, x2) - GRID / 2;
      const maxX = Math.max(x1, x2) + GRID / 2;
      const minY = Math.min(y1, y2) - GRID / 2;
      const maxY = Math.max(y1, y2) + GRID / 2;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        return true;
      }
    }
    return false;
  });
};

export const runAStar = (start: { x: number; y: number }, end: { x: number; y: number }, walls: Wall[]) => {
  const openSet = new Map<string, Node>();
  const closedSet = new Set<string>();

  const startNode: Node = { x: start.x, y: start.y, g: 0, h: heuristic(start, end), f: heuristic(start, end) };
  openSet.set(key(startNode.x, startNode.y), startNode);

  while (openSet.size > 0) {
    const current = Array.from(openSet.values()).reduce((prev, curr) => (curr.f < prev.f ? curr : prev));
    const currentKey = key(current.x, current.y);

    if (current.x === end.x && current.y === end.y) {
      const path: { x: number; y: number }[] = [];
      let node: Node | undefined = current;
      while (node) {
        path.unshift({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path;
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    const neighbours = getNeighbours(current);
    for (const neighbour of neighbours) {
      const neighbourKey = key(neighbour.x, neighbour.y);
      if (closedSet.has(neighbourKey) || isBlocked(neighbour.x, neighbour.y, walls)) {
        continue;
      }

      const gScore = current.g + GRID;
      let neighbourNode = openSet.get(neighbourKey);
      if (!neighbourNode) {
        neighbourNode = {
          ...neighbour,
          g: gScore,
          h: heuristic(neighbour, end),
          f: gScore + heuristic(neighbour, end),
          parent: current
        };
        openSet.set(neighbourKey, neighbourNode);
      } else if (gScore < neighbourNode.g) {
        neighbourNode.g = gScore;
        neighbourNode.f = gScore + neighbourNode.h;
        neighbourNode.parent = current;
      }
    }
  }

  return [start, end];
};
