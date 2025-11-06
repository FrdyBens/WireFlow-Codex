export type Wall = {
  id: string;
  points: number[]; // [x1, y1, x2, y2, ...]
};

export type DeviceType =
  | 'socket'
  | 'light'
  | 'switch'
  | 'water_heater'
  | 'cooker'
  | 'ac'
  | 'data';

export type Device = {
  id: string;
  type: DeviceType;
  position: { x: number; y: number };
  circuitId: string | null;
  loadW: number;
};

export type Circuit = {
  id: string;
  name: string;
  breakerType: string;
  breakerSizeA: number;
  voltage: number;
  maxLoadW: number;
  devices: string[];
};

export type RouteSegment = {
  id: string;
  deviceId: string;
  circuitId: string | null;
  points: number[];
  length: number;
  conduitSizeMM: number;
};

export type BomItem = {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  unit: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  category?: string;
  circuitId?: string | null;
};

export type PricingItem = {
  sku: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  vendor: string;
  category: string;
};

export type ProjectState = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  walls: Wall[];
  devices: Device[];
  circuits: Circuit[];
  routes: RouteSegment[];
};
