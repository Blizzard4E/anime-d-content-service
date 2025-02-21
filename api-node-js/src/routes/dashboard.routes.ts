// src/routes/dashboard.routes.ts
import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, dashboardController.getDashboardStats);

export default router;
