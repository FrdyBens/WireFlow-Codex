import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const projects = await req.prisma.project.findMany();
  res.json(projects);
});

router.post('/', async (req, res) => {
  const { name, description, ...rest } = req.body;
  const project = await req.prisma.project.create({
    data: {
      name,
      description,
      data: { description, name, ...rest }
    }
  });
  res.status(201).json(project);
});

router.get('/:id', async (req, res) => {
  const project = await req.prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(project);
});

router.put('/:id', async (req, res) => {
  const { name, description, ...rest } = req.body;
  const project = await req.prisma.project.update({
    where: { id: req.params.id },
    data: { name, description, data: { description, name, ...rest } }
  });
  res.json(project);
});

export default router;
