import { Request, Response } from 'express';
import { Episode } from '../models/Episode';
import { Anime } from '../models/Anime';
import { createEpisodeSchema, createBulkEpisodesSchema } from '../validation/episode.schema';

export const createEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createEpisodeSchema.parse(req.body);
    const file = req.file;

    const anime = await Anime.findById(validatedData.animeId);
    if (!anime) {
      res.status(404).json({ error: 'Anime not found' });
      return;
    }

    const episode = new Episode({
      ...validatedData,
      videoUrl: file ? file.path : undefined,
    });

    await episode.save();
    anime.episodes.push(episode._id);
    await anime.save();

    res.status(201).json(episode);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
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
