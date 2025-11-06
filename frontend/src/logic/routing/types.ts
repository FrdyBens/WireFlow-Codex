import type { Device } from '../../state/useProjectStore';

export interface RoutingInput {
  devices: Device[];
  panels: { id: string; x?: number; y?: number }[];
  circuits: { id: string; deviceIds: string[] }[];
}

export interface RoutingSegment {
  id: string;
  circuitId: string;
  points: [number, number][];
  length: number;
  conduit: string;
}
