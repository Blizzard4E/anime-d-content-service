import { z } from 'zod';

export const createStudioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export const updateStudioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});
