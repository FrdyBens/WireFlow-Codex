import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { estimateSlack } from '../logic/routing/slack';
import { runAutoRouting } from '../logic/routing/router';
import { generateBom } from '../logic/costing/bom';
import { calculateVoltageDrop } from '../logic/standards/voltageDrop';
import { selectBreaker } from '../logic/standards/breaker';
import { sizeConduitForCableBundle } from '../logic/standards/conduit';

export type Wall = {
  id: string;
  points: number[]; // [x1, y1, x2, y2]
};

export type DeviceType =
  | 'socket'
  | 'light'
  | 'switch'
  | 'water-heater'
  | 'cooker'
  | 'ac'
  | 'data';

export interface Device {
  id: string;
  type: DeviceType;
  x: number;
  y: number;
  circuitId?: string;
  loadVA: number;
}

export interface Circuit {
  id: string;
  name: string;
  breakerType: 'MCB' | 'RCCB' | 'RCBO';
  breakerRating: number;
  voltageDrop: number;
  length: number;
  conduit?: string;
  deviceIds: string[];
}

export interface Panel {
  id: string;
  name: string;
  supplyVoltage: number;
  maxDemandVA: number;
  circuitIds: string[];
}

export interface RouteSegment {
  id: string;
  points: [number, number][];
  circuitId: string;
  length: number;
  conduit: string;
}

export type ActiveTool = 'select' | 'wall' | DeviceType;

export interface ProjectState {
  projectName: string;
  walls: Wall[];
  devices: Device[];
  circuits: Circuit[];
  panels: Panel[];
  routes: RouteSegment[];
  bom: ReturnType<typeof generateBom>;
  activeTool: ActiveTool;
  addWall: (points: number[]) => void;
  addDevice: (type: DeviceType, x: number, y: number) => void;
  addCircuit: (panelId: string, name: string, breakerType: Circuit['breakerType']) => void;
  assignDeviceToCircuit: (deviceId: string, circuitId: string) => void;
  runRouting: () => void;
  renameProject: (name: string) => void;
  setActiveTool: (tool: ActiveTool) => void;
}

const DEFAULT_DEVICE_LOAD: Record<DeviceType, number> = {
  socket: 500,
  light: 100,
  switch: 10,
  'water-heater': 2000,
  cooker: 4500,
  ac: 1200,
  data: 15
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projectName: 'New Project',
      walls: [],
      devices: [],
      circuits: [],
      panels: [
        {
          id: nanoid(),
          name: 'Main DB',
          supplyVoltage: 230,
          maxDemandVA: 0,
          circuitIds: []
        }
      ],
      routes: [],
      bom: generateBom([], []),
      activeTool: 'select',
      addWall: (points) =>
        set((state) => ({
          walls: [...state.walls, { id: nanoid(), points }]
        })),
      addDevice: (type, x, y) =>
        set((state) => ({
          devices: [
            ...state.devices,
            {
              id: nanoid(),
              type,
              x,
              y,
              loadVA: DEFAULT_DEVICE_LOAD[type]
            }
          ]
        })),
      addCircuit: (panelId, name, breakerType) =>
        set((state) => {
          const circuitId = nanoid();
          const breakerRating = selectBreaker({
            loadVA: 0,
            voltage: 230,
            breakerType
          });
          return {
            circuits: [
              ...state.circuits,
              {
                id: circuitId,
                name,
                breakerType,
                breakerRating,
                voltageDrop: 0,
                length: 0,
                deviceIds: []
              }
            ],
            panels: state.panels.map((panel) =>
              panel.id === panelId
                ? { ...panel, circuitIds: [...panel.circuitIds, circuitId] }
                : panel
            )
          };
        }),
      assignDeviceToCircuit: (deviceId, circuitId) =>
        set((state) => {
          const devices = state.devices.map((device) =>
            device.id === deviceId ? { ...device, circuitId } : device
          );
          const circuits = state.circuits.map((circuit) =>
            circuit.id === circuitId
              ? { ...circuit, deviceIds: Array.from(new Set([...circuit.deviceIds, deviceId])) }
              : { ...circuit, deviceIds: circuit.deviceIds.filter((id) => id !== deviceId) }
          );

          return { devices, circuits };
        }),
      runRouting: () => {
        const state = get();
        const routingResult = runAutoRouting(state);
        const circuits = state.circuits.map((circuit) => {
          const segments = routingResult.filter((segment) => segment.circuitId === circuit.id);
          const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0);
          const slack = estimateSlack(totalLength);
          const loadVA = circuit.deviceIds.reduce((sum, deviceId) => {
            const device = state.devices.find((d) => d.id === deviceId);
            return device ? sum + device.loadVA : sum;
          }, 0);
          const voltageDrop = calculateVoltageDrop({
            lengthMeters: totalLength + slack,
            currentAmps: loadVA / 230,
            conductorAreaMm2: 2.5,
            resistivity: 0.0175,
            voltage: 230
          });
          const breakerRating = selectBreaker({
            loadVA,
            voltage: 230,
            breakerType: circuit.breakerType
          });
          const bundleSize = sizeConduitForCableBundle({
            cableCount: Math.max(1, circuit.deviceIds.length),
            conductorAreaMm2: 2.5,
            insulationType: 'PVC'
          });
          return {
            ...circuit,
            breakerRating,
            voltageDrop,
            length: totalLength + slack,
            conduit: bundleSize
          } as Circuit & { conduit: string };
        });

        const bom = generateBom(routingResult, state.devices);
        set({ routes: routingResult, circuits, bom });
      },
      renameProject: (name) => set({ projectName: name }),
      setActiveTool: (tool) => set({ activeTool: tool })
    }),
    {
      name: 'wireflow-project'
    }
  )
);
