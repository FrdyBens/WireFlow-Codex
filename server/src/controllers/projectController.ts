import type { Request, Response } from 'express';
import { createOrUpdateProject, getProject, listProjects } from '../services/projectService.js';
import { generateBomEstimate } from '../services/costingService.js';

export async function getProjectsHandler(_request: Request, response: Response) {
  const projects = await listProjects();
  response.json(projects);
}

export async function getProjectHandler(request: Request, response: Response) {
  const id = Number(request.params.id);
  if (Number.isNaN(id)) {
    response.status(400).json({ error: 'Invalid project id' });
    return;
  }
  const project = await getProject(id);
  if (!project) {
    response.status(404).json({ error: 'Project not found' });
    return;
  }
  response.json(project);
}

export async function saveProjectHandler(request: Request, response: Response) {
  const { id, name, payload } = request.body;
  if (!name || !payload) {
    response.status(400).json({ error: 'Missing project name or payload' });
    return;
  }
  const saved = await createOrUpdateProject(name, payload, id);
  response.json(saved);
}

export async function bomEstimateHandler(request: Request, response: Response) {
  const { segments = [], devices = [] } = request.body ?? {};
  const bom = await generateBomEstimate(segments, devices);
  response.json(bom);
}
