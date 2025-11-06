import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api', apiRouter);

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`WireFlow server listening on port ${port}`);
});
