import { Router } from 'express';
import multer from 'multer';
import {
  getProjectsHandler,
  getProjectHandler,
  saveProjectHandler,
  bomEstimateHandler
} from '../controllers/projectController.js';
import { getPricingHandler, uploadPricingHandler } from '../controllers/pricingController.js';

const upload = multer();

export const apiRouter = Router();

apiRouter.get('/projects', getProjectsHandler);
apiRouter.get('/projects/:id', getProjectHandler);
apiRouter.post('/projects', saveProjectHandler);
apiRouter.post('/bom/estimate', bomEstimateHandler);

apiRouter.get('/pricing', getPricingHandler);
apiRouter.post('/pricing/import', upload.single('file'), uploadPricingHandler);
