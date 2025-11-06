import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Circuit, Device, ProjectState, RouteSegment, Wall } from '../types';
import { generateBom } from '../logic/costing/bom';
import { pricingDb } from '../data/catalog/pricingDb';
import exampleProject from '../data/catalog/example-project.json';
import { defaultPricing } from '../data/catalog/defaultPricing';

export type ToolSelection = 'wall' | `device:${string}` | null;

export interface ProjectStore extends ProjectState {
  selectedTool: ToolSelection;
  selectedDeviceId: string | null;
  bom: ReturnType<typeof generateBom>;
  addWall: (wall: Wall) => void;
  addDevice: (device: Omit<Device, 'loadW'>) => void;
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  setSelectedDevice: (deviceId: string | null) => void;
  setSelectedTool: (tool: ToolSelection) => void;
  addCircuit: (circuit: Circuit) => void;
  assignDeviceToCircuit: (deviceId: string, circuitId: string) => void;
  updateRoutes: (routes: RouteSegment[]) => void;
  refreshBom: () => Promise<void>;
  loadProjectFromFile: (file: File) => Promise<void>;
}

const defaultState: ProjectState = {
  id: 'demo-project',
  name: 'New Electrical Layout',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  walls: exampleProject.walls,
  devices: exampleProject.devices,
  circuits: exampleProject.circuits,
  routes: []
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      selectedTool: null,
      selectedDeviceId: null,
      bom: generateBom(defaultState.devices, defaultState.routes, defaultState.circuits, defaultPricing),
      addWall: (wall) =>
        set((state) => ({
          walls: [...state.walls, wall],
          updatedAt: new Date().toISOString()
        })),
      addDevice: (device) =>
        set((state) => ({
          devices: [
            ...state.devices,
            {
              ...device,
              loadW: exampleProject.deviceDefaults[device.type] ?? 0
            }
          ],
          updatedAt: new Date().toISOString()
        })),
      updateDevice: (deviceId, updates) =>
        set((state) => ({
          devices: state.devices.map((device) => (device.id === deviceId ? { ...device, ...updates } : device)),
          updatedAt: new Date().toISOString()
        })),
      setSelectedDevice: (selectedDeviceId) => set({ selectedDeviceId }),
      setSelectedTool: (selectedTool) => set({ selectedTool }),
      addCircuit: (circuit) =>
        set((state) => ({
          circuits: [...state.circuits, circuit],
          updatedAt: new Date().toISOString()
        })),
      assignDeviceToCircuit: (deviceId, circuitId) =>
        set((state) => ({
          devices: state.devices.map((device) =>
            device.id === deviceId ? { ...device, circuitId } : device
          ),
          circuits: state.circuits.map((circuit) =>
            circuit.id === circuitId
              ? { ...circuit, devices: Array.from(new Set([...circuit.devices, deviceId])) }
              : circuit
          ),
          updatedAt: new Date().toISOString()
        })),
      updateRoutes: (routes) =>
        set({
          routes,
          updatedAt: new Date().toISOString()
        }),
      refreshBom: async () => {
        const pricing = await pricingDb.items.toArray();
        const pricingData = pricing.length > 0 ? pricing : defaultPricing;
        const { devices, routes, circuits } = get();
        set({ bom: generateBom(devices, routes, circuits, pricingData) });
      },
      loadProjectFromFile: async (file: File) => {
        const text = await file.text();
        const parsed = JSON.parse(text);
        set({
          ...parsed,
          updatedAt: new Date().toISOString()
        });
        await get().refreshBom();
      }
    }),
    {
      name: 'wireflow-project'
    }
  )
);
