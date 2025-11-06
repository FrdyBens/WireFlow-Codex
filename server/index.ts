import express from 'express';
import cors from 'cors';
import multer from 'multer';
import PDFDocument from 'pdfkit';
import { pricingDb, upsertPricingItems, getPricingItems, PricingItemInput } from './pricingService';
import { getProjectRepository } from './projects';
import { generateBom } from '../src/logic/costing/bom';
import exampleProject from '../src/data/catalog/example-project.json';
import { PricingItem as ClientPricingItem } from '../src/types';
import { defaultPricing } from '../src/data/catalog/defaultPricing';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/api/projects', async (_req, res) => {
  const repo = await getProjectRepository();
  const projects = await repo.list();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const repo = await getProjectRepository();
  const saved = await repo.save(req.body);
  res.json(saved);
});

app.post('/api/pricing/upload', upload.single('file'), async (req, res) => {
  const buffer = req.file?.buffer;
  if (!buffer) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const rows = buffer.toString('utf-8').split(/\r?\n/).filter(Boolean);
  const [headerLine, ...dataLines] = rows;
  const headers = headerLine.split(',');
  const items: PricingItemInput[] = dataLines.map((line) => {
    const cols = line.split(',');
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header.trim()] = cols[index];
    });
    return {
      sku: record['sku'],
      name: record['name'],
      description: record['description'],
      unit: record['unit'],
      price: Number(record['price']),
      vendor: record['vendor'],
      category: record['category']
    };
  });
  await upsertPricingItems(items);
  res.json({ count: items.length });
});

app.get('/api/pricing', async (_req, res) => {
  const items = await getPricingItems();
  res.json(items);
});

app.get('/api/export/csv', async (_req, res) => {
  const repo = await getProjectRepository();
  const project = (await repo.list())[0] ?? exampleProject;
  const pricingRecords = await pricingDb.pricingItem.findMany();
  const pricing: ClientPricingItem[] = (pricingRecords.length ? pricingRecords : defaultPricing).map((record: any) => ({
    sku: record.sku,
    name: record.name,
    description: record.description,
    unit: record.unit,
    price: record.price,
    vendor: record.vendor,
    category: record.category
  }));
  const bom = generateBom(project.devices, project.routes, project.circuits, pricing);
  const header = 'name,unit,quantity,totalPrice\n';
  const rows = bom.items
    .map((item) => `${item.name},${item.unit},${item.quantity.toFixed(2)},${item.totalPrice ?? ''}`)
    .join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('bom.csv');
  res.send(`${header}${rows}`);
});

app.get('/api/export/pdf', async (_req, res) => {
  const repo = await getProjectRepository();
  const project = (await repo.list())[0] ?? exampleProject;
  const pricingRecords = await pricingDb.pricingItem.findMany();
  const pricing: ClientPricingItem[] = (pricingRecords.length ? pricingRecords : defaultPricing).map((record: any) => ({
    sku: record.sku,
    name: record.name,
    description: record.description,
    unit: record.unit,
    price: record.price,
    vendor: record.vendor,
    category: record.category
  }));
  const bom = generateBom(project.devices, project.routes, project.circuits, pricing);

  const doc = new PDFDocument();
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => {
    const result = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="project-summary.pdf"');
    res.send(result);
  });

  doc.fontSize(18).text('WireFlow Codex - Project Summary', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Project: ${project.name}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown();
  doc.fontSize(14).text('Bill of Materials');
  bom.items.forEach((item) => {
    doc.fontSize(10).text(`${item.name} — ${item.quantity.toFixed(2)} ${item.unit} (£${item.totalPrice?.toFixed(2) ?? 'N/A'})`);
  });
  doc.end();
});

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
