import type { Express, Request, Response } from 'express';
import { listPricing, importPricingCsv } from '../services/pricingService.js';

export async function getPricingHandler(_request: Request, response: Response) {
  const items = await listPricing();
  response.json(items);
}

type MulterRequest = Request & { file?: Express.Multer.File };

export async function uploadPricingHandler(request: MulterRequest, response: Response) {
  const csvContent = request.file?.buffer?.toString('utf-8');
  if (!csvContent) {
    response.status(400).json({ error: 'No CSV uploaded' });
    return;
  }
  const items = await importPricingCsv(csvContent);
  response.json(items);
}
