import { Router } from 'express';
import * as episodeController from '../controllers/episode.controller';
import { auth } from '../middleware/auth';
import { videoUpload } from '../middleware/upload'; // Use videoUpload instead

const router = Router();

router.post('/', auth, videoUpload.single('video'), episodeController.createEpisode);
router.post('/bulk', auth, episodeController.createBulkEpisodes);
router.post('/:id/upload-video', auth, videoUpload.single('video'), episodeController.uploadVideo);
router.delete('/:id', auth, episodeController.deleteEpisode);

export default router;
