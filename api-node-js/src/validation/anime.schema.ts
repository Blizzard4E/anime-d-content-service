import { z } from 'zod';

export const createAnimeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
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
  studio: z.string().optional(),
  releaseDate: z.string(),
  status: z.string(),
  trailerUrl: z.string(),
});

export const updateAnimeSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  genres: z
    .union([
      z.string().array(),
      z.string().transform(str => {
        try {
          const parsed = JSON.parse(str);
          return Array.isArray(parsed) ? parsed : [str];
        } catch {
          return [str];
        }
      }),
    ])
    .optional(),
  studio: z.string().optional(),
  releaseDate: z.string().optional(),
  status: z.string().optional(),
  trailerUrl: z.string().optional(),
});
