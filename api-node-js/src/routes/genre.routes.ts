// src/routes/genre.routes.ts
import { Router } from 'express';
import * as genreController from '../controllers/genre.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenre);

// Protected routes that require authentication
router.post('/', auth, genreController.createGenre);
router.put('/:id', auth, genreController.updateGenre);
router.delete('/:id', auth, genreController.deleteGenre);

export default router;
