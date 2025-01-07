import { Router } from 'express';
import * as animeController from '../controllers/anime.controller';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', animeController.getAnimes);
router.get('/:id', animeController.getAnime);

// Protected routes
router.post(
  '/',
  auth,
  upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  animeController.createAnime,
);

router.put(
  '/:id',
  auth,
  upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  animeController.updateAnime,
);

router.delete('/:id', auth, animeController.deleteAnime);

export default router;
