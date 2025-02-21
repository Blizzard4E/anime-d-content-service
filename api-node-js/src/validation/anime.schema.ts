// validation/anime.schema.ts
import { z } from 'zod';

const AnimeStatus = z.enum(['ongoing', 'completed']);

export const createAnimeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  genres: z.union([
    z.string().array(),
    z.string().transform(str => {
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [str];
      } catch {
        return [str];
      }
    }),
  ]),
  studio: z.string({
    required_error: 'Studio is required',
  }),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
  status: AnimeStatus,
  // Make trailerUrl optional since it will be set from the file
  trailerUrl: z.string().min(1, 'Trailer URL is required').optional(),
});

// validation/episode.schema.ts
export const createEpisodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  episodeNumber: z.string().min(1, 'Episode number is required'),
  animeId: z.string().min(1, 'Anime ID is required'),
  duration: z.number().optional(),
});
