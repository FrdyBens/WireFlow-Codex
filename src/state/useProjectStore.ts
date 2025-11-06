import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectData, Circuit, Device, Panel } from '../types/project';
import { estimateSlack } from '../logic/costing/estimators';
import { buildBillOfMaterials } from '../logic/costing/bom';
import { PricingCatalog, lookupPrices } from '../logic/costing/pricing';
import { autoRouteProject } from '../logic/routing/autoRouter';

export interface ProjectState {
  project: ProjectData;
  pricing: PricingCatalog | null;
  bom: ReturnType<typeof buildBillOfMaterials> | null;
  setProject: (project: ProjectData) => void;
  updateDevices: (devices: Device[]) => void;
  updateCircuits: (circuits: Circuit[]) => void;
  updatePanels: (panels: Panel[]) => void;
  loadPricing: (catalog: PricingCatalog) => void;
  autoRoute: () => void;
  recalcBom: () => void;
}

const emptyProject: ProjectData = {
  id: 'new',
  name: 'Untitled Project',
  description: '',
  walls: [],
  devices: [],
  circuits: [],
  panels: [],
  routing: { segments: [] }
};

export const useProjectStore = create<ProjectState>()(
  persist<ProjectState>(
    (set, get) => ({
      project: emptyProject,
      pricing: null,
      bom: null,
      setProject: (project) => set({ project }),
      updateDevices: (devices) => set((state) => ({ project: { ...state.project, devices } })),
      updateCircuits: (circuits) => set((state) => ({ project: { ...state.project, circuits } })),
      updatePanels: (panels) => set((state) => ({ project: { ...state.project, panels } })),
      loadPricing: (pricing) => {
        set({ pricing });
        const catalog = lookupPrices(pricing, get().project);
        set({ bom: buildBillOfMaterials(get().project, catalog) });
      },
      autoRoute: () => {
        const project = get().project;
        const withRouting = autoRouteProject(project, estimateSlack);
        set({ project: withRouting });
        get().recalcBom();
      },
      recalcBom: () => {
        const state = get();
        if (!state.pricing) {
          set({ bom: buildBillOfMaterials(state.project, null) });
          return;
        }
        const catalog = lookupPrices(state.pricing, state.project);
        set({ bom: buildBillOfMaterials(state.project, catalog) });
      }
    }),
    {
      name: 'wireflow-project-storage'
    }
  )
);
