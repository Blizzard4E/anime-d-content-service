import { Request, Response } from 'express';
import { Episode } from '../models/Episode';
import { Anime } from '../models/Anime';
import { createEpisodeSchema, createBulkEpisodesSchema } from '../validation/episode.schema';
import { z } from 'zod';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

export const createEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    // Log the raw request body for debugging
    console.log('Raw request body:', req.body);

    const validatedData = createEpisodeSchema.parse(req.body);
    const file = req.file;

    // Clean the animeId string (remove any extra quotes)
    const cleanAnimeId = validatedData.animeId.replace(/['"]+/g, '');

    if (!mongoose.Types.ObjectId.isValid(cleanAnimeId)) {
      res.status(400).json({
        error: 'Invalid anime ID format',
        receivedId: validatedData.animeId,
      });
      return;
    }

    const anime = await Anime.findById(cleanAnimeId);
    if (!anime) {
      res.status(404).json({
        error: 'Anime not found',
        searchedId: cleanAnimeId,
      });
      return;
    }

    const episode = new Episode({
      ...validatedData,
      animeId: cleanAnimeId,
      videoUrl: file ? file.path : undefined,
    });

    await episode.save();
    anime.episodes.push(episode._id);
    await anime.save();

    res.status(201).json(episode);
  } catch (error: unknown) {
    console.error('Error creating episode:', error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.format(), // Using format() instead of accessing errors directly
      });
    } else if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
        type: 'General error',
      });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const createBulkEpisodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createBulkEpisodesSchema.parse(req.body);
    const animeId = validatedData[0].animeId; // All episodes should be for the same anime

    const anime = await Anime.findById(animeId);
    if (!anime) {
      res.status(404).json({ error: 'Anime not found' });
      return;
    }

    const episodes = await Episode.insertMany(validatedData);
    anime.episodes.push(...episodes.map(ep => ep._id));
    await anime.save();

    res.status(201).json(episodes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No video file provided' });
      return;
    }

    const episode = await Episode.findById(id);
    if (!episode) {
      res.status(404).json({ error: 'Episode not found' });
      return;
    }

    episode.videoUrl = file.path;
    await episode.save();

    res.json(episode);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const deleteEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid episode ID format' });
      return;
    }

    // Find the episode
    const episode = await Episode.findById(id);
    if (!episode) {
      res.status(404).json({ error: 'Episode not found' });
      return;
    }

    // Find the parent anime and remove the episode reference
    await Anime.findByIdAndUpdate(episode.animeId, { $pull: { episodes: episode._id } });

    // Delete the video file if it exists
    if (episode.videoUrl) {
      try {
        await fs.unlink(path.join(process.cwd(), episode.videoUrl));
      } catch (error) {
        console.error('Error deleting video file:', error);
        // Continue with episode deletion even if file deletion fails
      }
    }

    // Delete the episode
    await Episode.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Episode deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Error deleting episode:', error);

    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
        type: 'Delete operation failed',
      });
    } else {
      res.status(500).json({
        error: 'An unknown error occurred while deleting the episode',
      });
    }
  }
};
