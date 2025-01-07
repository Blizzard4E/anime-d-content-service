// src/controllers/genre.controller.ts
import { Request, Response } from 'express';
import { Genre } from '../models/Genre';
import { createGenreSchema, updateGenreSchema } from '../validation/genre.schema';

export const createGenre = async (req: Request, res: Response) => {
  try {
    const validatedData = createGenreSchema.parse(req.body);
    const genre = new Genre(validatedData);
    await genre.save();
    res.status(201).json(genre);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getGenre = async (req: Request, res: Response) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      res.status(404).json({ error: 'Genre not found' });
      return;
    }
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  try {
    const validatedData = updateGenreSchema.parse(req.body);
    const genre = await Genre.findByIdAndUpdate(req.params.id, validatedData, { new: true });
    if (!genre) {
      res.status(404).json({ error: 'Genre not found' });
      return;
    }
    res.json(genre);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      res.status(404).json({ error: 'Genre not found' });
      return;
    }
    res.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
