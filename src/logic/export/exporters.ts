import axios from 'axios';
import { BomSummary } from '../costing/bom';
import { ProjectData } from '../../types/project';

export async function exportBomCsv(bom: BomSummary): Promise<Blob> {
  const response = await axios.post('/api/export/csv', { bom }, { responseType: 'blob' });
  return response.data as Blob;
}

export async function exportProjectPdf(project: ProjectData, bom: BomSummary): Promise<Blob> {
  const response = await axios.post('/api/export/pdf', { project, bom }, { responseType: 'blob' });
  return response.data as Blob;
}
