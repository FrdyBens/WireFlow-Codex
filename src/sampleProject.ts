import { ProjectData } from './types/project';

export const sampleProject: ProjectData = {
  id: 'sample-1',
  name: 'Sample Apartment',
  description: 'Two room sample project with lighting and socket circuits.',
  walls: [
    {
      id: 'wall-1',
      thickness: 8,
      points: [
        [50, 50],
        [1150, 50],
        [1150, 750],
        [50, 750]
      ]
    }
  ],
  devices: [
    {
      id: 'device-db',
      name: 'Distribution Board',
      type: 'distribution_board',
      position: { x: 100, y: 120 }
    },
    {
      id: 'device-light-1',
      name: 'Ceiling Light - Lounge',
      type: 'light',
      circuitId: 'circuit-light',
      position: { x: 400, y: 200 },
      loadVA: 150
    },
    {
      id: 'device-socket-1',
      name: 'Socket - Lounge',
      type: 'socket',
      circuitId: 'circuit-ring',
      position: { x: 450, y: 450 },
      loadVA: 800
    },
    {
      id: 'device-socket-2',
      name: 'Socket - Bedroom',
      type: 'socket',
      circuitId: 'circuit-ring',
      position: { x: 800, y: 500 },
      loadVA: 600
    }
  ],
  panels: [
    {
      id: 'panel-main',
      name: 'Main DB',
      mainBreakerRating: 63,
      supplyVoltage: 230,
      position: { x: 100, y: 120 }
    }
  ],
  circuits: [
    {
      id: 'circuit-light',
      name: 'Lighting Circuit',
      panelId: 'panel-main',
      breakerType: 'MCB',
      breakerRating: 10,
      maxLoadVA: 2000,
      voltageDropLimit: 3,
      rulePreset: 'IEC'
    },
    {
      id: 'circuit-ring',
      name: 'Ring Circuit',
      panelId: 'panel-main',
      breakerType: 'MCB',
      breakerRating: 32,
      maxLoadVA: 7200,
      voltageDropLimit: 5,
      rulePreset: 'BS1363'
    }
  ],
  routing: {
    segments: []
  }
};
