// src/controllers/genre.controller.ts
import { Request, Response } from 'express';
import { Genre } from '../models/Genre';
import { createGenreSchema, updateGenreSchema } from '../validation/genre.schema';

export const createGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createGenreSchema.parse(req.body);
    const genre = new Genre(validatedData);
    await genre.save();

    res.status(201).json({
      success: true,
      message: 'Genre created successfully',
      data: genre,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const genres = await Genre.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Genres retrieved successfully',
      data: genres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve genres',
      error: (error as Error).message,
    });
  }
};

export const getGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      res.status(404).json({
        success: false,
        message: 'Genre not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Genre retrieved successfully',
      data: genre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve genre',
      error: (error as Error).message,
    });
  }
};

export const updateGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateGenreSchema.parse(req.body);

    const genre = await Genre.findByIdAndUpdate(req.params.id, validatedData, { new: true, runValidators: true });

    if (!genre) {
      res.status(404).json({
        success: false,
        message: 'Genre not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Genre updated successfully',
      data: genre,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update genre',
      error: (error as Error).message,
    });
  }
};

export const deleteGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) {
      res.status(404).json({
        success: false,
        message: 'Genre not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Genre deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete genre',
      error: (error as Error).message,
    });
  }
};
