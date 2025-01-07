import { z } from 'zod';

export const createEpisodeSchema = z.object({
  title: z.string(),
  episodeNumber: z.string(),
  animeId: z.string(),
});

export const createBulkEpisodesSchema = z.array(createEpisodeSchema);
