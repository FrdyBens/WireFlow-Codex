import { PrismaClient } from '@prisma/client';
import { ProjectState } from '../src/types';

const prisma = new PrismaClient();

export const getProjectRepository = async () => {
  return {
    list: async () => {
      const records = await prisma.project.findMany();
      if (records.length === 0) return [];
      return records.map((record) => record.payload as ProjectState);
    },
    save: async (project: ProjectState) => {
      await prisma.project.upsert({
        where: { id: project.id },
        create: {
          id: project.id,
          name: project.name,
          payload: project
        },
        update: {
          name: project.name,
          payload: project
        }
      });
      return project;
    }
  };
};
