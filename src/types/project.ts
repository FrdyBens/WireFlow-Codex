export type Wall = {
  id: string;
  points: [number, number][];
  thickness: number;
};

export type DeviceType =
  | 'socket'
  | 'light'
  | 'switch'
  | 'water_heater'
  | 'cooker'
  | 'ac'
  | 'data'
  | 'distribution_board';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  circuitId?: string;
  position: { x: number; y: number };
  loadVA?: number;
}

export interface Circuit {
  id: string;
  name: string;
  panelId: string;
  breakerType: 'MCB' | 'RCD' | 'RCBO';
  breakerRating: number;
  maxLoadVA: number;
  voltageDropLimit: number;
  rulePreset: 'IEC' | 'BS1363';
  notes?: string;
}

export interface Panel {
  id: string;
  name: string;
  mainBreakerRating: number;
  supplyVoltage: number;
  position?: { x: number; y: number };
}

export interface RoutingSegment {
  id: string;
  type: 'cable' | 'conduit';
  circuitId: string;
  path: { x: number; y: number }[];
  length: number;
  slack: number;
  conductorCount: number;
}

export interface ProjectRouting {
  segments: RoutingSegment[];
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  walls: Wall[];
  devices: Device[];
  circuits: Circuit[];
  panels: Panel[];
  routing: ProjectRouting;
}
