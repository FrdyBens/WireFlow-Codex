interface Node {
  id: string;
  position: { x: number; y: number };
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

export const buildMst = (nodes: Node[]) => {
  if (nodes.length <= 1) return [] as Edge[];
  const visited = new Set<string>();
  const edges: Edge[] = [];
  visited.add(nodes[0].id);

  while (visited.size < nodes.length) {
    let bestEdge: Edge | null = null;

    for (const nodeId of Array.from(visited)) {
      const node = nodes.find((n) => n.id === nodeId)!;
      for (const target of nodes) {
        if (visited.has(target.id)) continue;
        const weight = Math.hypot(node.position.x - target.position.x, node.position.y - target.position.y);
        if (!bestEdge || weight < bestEdge.weight) {
          bestEdge = { from: node.id, to: target.id, weight };
        }
      }
    }

    if (bestEdge) {
      edges.push(bestEdge);
      visited.add(bestEdge.to);
    } else {
      break;
    }
  }

  return edges;
};
