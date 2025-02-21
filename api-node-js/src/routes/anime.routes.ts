// routes/anime.routes.ts
import { Router } from 'express';
import * as animeController from '../controllers/anime.controller';
import { auth } from '../middleware/auth';
import { animeUpload, imageUpload, videoUpload } from '../middleware/upload';
import { RequestHandler } from 'express';

const router = Router();

// Public routes
router.get('/', animeController.getAnimes);
router.get('/:id', animeController.getAnime);

// Protected routes
router.post(
  '/',
  auth,
  animeUpload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'trailer', maxCount: 1 },
  ]) as RequestHandler,
  animeController.createAnime as RequestHandler,
);

router.put(
  '/:id',
  auth,
  imageUpload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]) as RequestHandler,
  animeController.updateAnime as RequestHandler,
);

router.post(
  '/upload-trailer/:id',
  auth,
  videoUpload.single('trailer') as RequestHandler,
  animeController.uploadTrailer as RequestHandler,
);

router.delete('/:id', auth, animeController.deleteAnime);

export default router;
