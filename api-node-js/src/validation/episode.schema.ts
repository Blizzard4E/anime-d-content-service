// validation/episode.schema.ts
import { z } from 'zod';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const objectIdSchema = z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const createEpisodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  episodeNumber: z.string().min(1, 'Episode number is required'),
  animeId: objectIdSchema,
  duration: z.number().optional(),
});

export const createBulkEpisodesSchema = z.array(createEpisodeSchema);
