import { Router } from 'express';
import * as episodeController from '../controllers/episode.controller';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', auth, upload.single('video'), episodeController.createEpisode);
router.post('/bulk', auth, episodeController.createBulkEpisodes);
router.post('/:id/upload-video', auth, upload.single('video'), episodeController.uploadVideo);

export default router;
