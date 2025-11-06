import { prisma } from '../db/prisma.js';

export async function listProjects() {
  return prisma.project.findMany({ orderBy: { updatedAt: 'desc' } });
}

export async function getProject(id: number) {
  return prisma.project.findUnique({ where: { id } });
}

export async function createOrUpdateProject(name: string, payload: unknown, id?: number) {
  if (id) {
    return prisma.project.update({ where: { id }, data: { name, payload } });
  }
  return prisma.project.create({ data: { name, payload } });
}
