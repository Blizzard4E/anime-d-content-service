import { z } from 'zod';

export const createGenreSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export const updateGenreSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});
