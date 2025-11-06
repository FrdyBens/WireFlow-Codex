import { Router } from 'express';
import multer from 'multer';
import { parsePricingCsv } from '../../src/logic/costing/pricing';

const upload = multer();
const router = Router();

router.get('/', async (req, res) => {
  const records = await req.prisma.pricingCatalog.findMany();
  res.json(records);
});

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Missing CSV file' });
    return;
  }
  try {
    const catalog = parsePricingCsv(req.file.buffer.toString('utf-8'));
    await req.prisma.pricingCatalog.upsert({
      where: { source: catalog.source },
      update: { items: catalog.items, updatedAt: catalog.updatedAt },
      create: { source: catalog.source, items: catalog.items, updatedAt: catalog.updatedAt }
    });
    res.json(catalog);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
