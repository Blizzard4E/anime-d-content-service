// src/routes/studio.routes.ts
import { Router } from 'express';
import * as studioController from '../controllers/studio.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', studioController.getStudios);
router.get('/:id', studioController.getStudio);

// Protected routes
router.post('/', auth, studioController.createStudio);
router.put('/:id', auth, studioController.updateStudio);
router.delete('/:id', auth, studioController.deleteStudio);

export default router;
