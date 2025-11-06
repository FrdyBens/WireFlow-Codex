import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import pricingRouter from './routes/pricing';
import projectRouter from './routes/projects';
import exportRouter from './routes/export';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use('/api/pricing', pricingRouter);
app.use('/api/projects', projectRouter);
app.use('/api/export', exportRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}
