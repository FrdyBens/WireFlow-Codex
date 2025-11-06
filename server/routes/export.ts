import { Router } from 'express';
import PDFDocument from 'pdfkit';

const router = Router();

router.post('/csv', (req, res) => {
  const { bom } = req.body;
  if (!bom) {
    res.status(400).json({ error: 'Missing BOM payload' });
    return;
  }
  const header = 'name,quantity,unit,unitPrice,total\n';
  const rows = bom.items
    .map((item: any) =>
      [item.name, item.quantity, item.unit, item.unitPrice ?? '', item.total ?? ''].join(',')
    )
    .join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="bom.csv"');
  res.send(header + rows);
});

router.post('/pdf', (req, res) => {
  const { project, bom } = req.body;
  if (!project || !bom) {
    res.status(400).json({ error: 'Missing project or BOM payload' });
    return;
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="summary.pdf"');
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(20).text(project.name, { underline: true });
  doc.moveDown().fontSize(12).text(`Description: ${project.description ?? 'N/A'}`);
  doc.moveDown().text(`Total Cost: £${bom.totalCost.toFixed(2)}`);
  doc.moveDown().text('Warnings:');
  if (bom.warnings.length === 0) {
    doc.text('None');
  } else {
    bom.warnings.forEach((warning: string) => doc.text(`- ${warning}`));
  }
  doc.moveDown().text('Items:');
  bom.items.forEach((item: any) => {
    doc.text(`${item.quantity}x ${item.name} (${item.unit}) - £${item.total ?? 0}`);
  });
  doc.end();
});

export default router;
