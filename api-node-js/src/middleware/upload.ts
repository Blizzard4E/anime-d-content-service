// middleware/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/config';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_VIDEO_TYPES = ['video/mp4'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB for videos

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let type: string;
    if (file.fieldname === 'video') {
      type = 'videos';
    } else if (['poster', 'cover', 'logo'].includes(file.fieldname)) {
      type = 'images';
    } else if (file.fieldname === 'trailer') {
      type = 'trailers';
    } else {
      type = 'others';
    }

    const dir = path.join(config.uploadDir, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const imageUpload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only JPG and PNG files are allowed for images!'));
    }
    cb(null, true);
  },
});

export const videoUpload = multer({
  storage,
  limits: {
    fileSize: MAX_VIDEO_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only MP4 files are allowed for videos!'));
    }
    cb(null, true);
  },
});

export const animeUpload = multer({
  storage,
  limits: {
    fileSize: MAX_VIDEO_SIZE, // Use video size limit since it's larger
  },
  fileFilter: (req, file, cb) => {
    if (['poster', 'cover', 'logo'].includes(file.fieldname)) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return cb(new Error('Only JPG and PNG files are allowed for images!'));
      }
    } else if (file.fieldname === 'trailer') {
      if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
        return cb(new Error('Only MP4 files are allowed for videos!'));
      }
    }
    cb(null, true);
  },
});
