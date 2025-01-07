import { Request, Response } from 'express';
import { Anime } from '../models/Anime';
import { createAnimeSchema, updateAnimeSchema } from '../validation/anime.schema';

export const createAnime = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Parse the genres if it's a string
    if (typeof req.body.genres === 'string') {
      try {
        req.body.genres = JSON.parse(req.body.genres);
      } catch (error) {
        req.body.genres = [req.body.genres];
      }
    }

    const validatedData = createAnimeSchema.parse(req.body);

    const anime = new Anime({
      ...validatedData,
      posterUrl: files.poster[0].path,
      coverUrl: files.cover[0].path,
      logoUrl: files.logo[0].path,
    });

    await anime.save();
    res.status(201).json(anime);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAnimes = async (req: Request, res: Response) => {
  try {
    const animes = await Anime.find().populate('genres').populate('studio').populate('episodes');
    res.json(animes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAnime = async (req: Request, res: Response): Promise<void> => {
  try {
    const anime = await Anime.findById(req.params.id).populate('genres').populate('studio').populate('episodes');

    if (!anime) {
      res.status(404).json({ error: 'Anime not found' });
      return;
    }

    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateAnime = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateAnimeSchema.parse(req.body);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const updateData = {
      ...validatedData,
      ...(files.poster && { posterUrl: files.poster[0].path }),
      ...(files.cover && { coverUrl: files.cover[0].path }),
      ...(files.logo && { logoUrl: files.logo[0].path }),
    };

    const anime = await Anime.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!anime) {
      res.status(404).json({ error: 'Anime not found' });
      return;
    }

    res.json(anime);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const deleteAnime = async (req: Request, res: Response): Promise<void> => {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);

    if (!anime) {
      res.status(404).json({ error: 'Anime not found' });
      return;
    }

    res.json({ message: 'Anime deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
