// controllers/anime.controller.ts
import { Request, Response, RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { Anime } from '../models/Anime';
import { createAnimeSchema } from '../validation/anime.schema';
import { deleteAnimeFiles, deleteFile } from '../utils/file-cleanup';

interface FileRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}

export const getAnimes: RequestHandler = async (req, res) => {
  try {
    const animes = await Anime.find().populate('genres').populate('studio').populate('episodes');
    res.status(200).json({
      success: true,
      message: 'Animes retrieved successfully',
      data: animes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to retrieve animes',
    });
  }
};

export const getAnime: RequestHandler = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id).populate('genres').populate('studio').populate('episodes');

    if (!anime) {
      res.status(404).json({
        success: false,
        message: 'Anime not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Anime retrieved successfully',
      data: anime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to retrieve anime',
    });
  }
};

// controllers/anime.controller.ts
export const createAnime: RequestHandler = async (req: Request, res) => {
  const uploadedFiles: string[] = [];

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (!files || !files.poster || !files.cover || !files.logo || !files.trailer) {
      throw new Error('Missing required files');
    }

    // Validate trailer file type
    const trailerFile = files.trailer[0];
    if (path.extname(trailerFile.originalname).toLowerCase() !== '.mp4') {
      await deleteFile(trailerFile.path);
      throw new Error('Invalid trailer file type. Only .mp4 files are allowed');
    }

    let genres = req.body.genres;
    if (typeof genres === 'string') {
      try {
        genres = JSON.parse(genres);
      } catch (error) {
        genres = [genres];
      }
    }

    // Add trailerUrl to the body before validation
    const validatedData = createAnimeSchema.parse({
      ...req.body,
      genres,
      trailerUrl: trailerFile.path, // Set the trailerUrl from the uploaded file
    });

    const anime = new Anime({
      ...validatedData,
      posterUrl: files.poster[0].path,
      coverUrl: files.cover[0].path,
      logoUrl: files.logo[0].path,
      trailerUrl: trailerFile.path,
    });

    uploadedFiles.push(files.poster[0].path, files.cover[0].path, files.logo[0].path, trailerFile.path);

    await anime.save();
    res.status(201).json({
      success: true,
      message: 'Anime created successfully',
      data: anime,
    });
  } catch (error) {
    // Clean up all uploaded files if there's an error
    for (const file of uploadedFiles) {
      await deleteFile(file);
    }
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create anime',
    });
  }
};

export const uploadTrailer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      throw new Error('No trailer file provided');
    }

    if (path.extname(file.originalname).toLowerCase() !== '.mp4') {
      fs.unlinkSync(file.path); // Delete invalid file
      throw new Error('Invalid file type. Only .mp4 files are allowed');
    }

    const anime = await Anime.findById(id);
    if (!anime) {
      fs.unlinkSync(file.path); // Delete orphan file
      throw new Error('Anime not found');
    }

    if (anime.trailerUrl) {
      const oldTrailerPath = anime.trailerUrl;
      if (fs.existsSync(oldTrailerPath)) {
        fs.unlinkSync(oldTrailerPath); // Delete old trailer
      }
    }

    anime.trailerUrl = file.path;
    await anime.save();

    res.status(200).json({
      success: true,
      message: 'Trailer uploaded successfully',
      data: anime,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload trailer',
    });
  }
};

export const updateAnime: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const updateData: any = { ...req.body };

    if (files) {
      if (files.poster) updateData.posterUrl = files.poster[0].path;
      if (files.cover) updateData.coverUrl = files.cover[0].path;
      if (files.logo) updateData.logoUrl = files.logo[0].path;
    }

    const anime = await Anime.findById(id);
    if (!anime) {
      throw new Error('Anime not found');
    }

    if (files?.trailer) {
      if (path.extname(files.trailer[0].originalname).toLowerCase() !== '.mp4') {
        fs.unlinkSync(files.trailer[0].path); // Delete invalid file
        throw new Error('Invalid file type. Only .mp4 files are allowed');
      }
      if (anime.trailerUrl && fs.existsSync(anime.trailerUrl)) {
        fs.unlinkSync(anime.trailerUrl); // Delete old trailer
      }
      updateData.trailerUrl = files.trailer[0].path;
    }

    const updatedAnime = await Anime.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedAnime) {
      throw new Error('Failed to update anime');
    }

    res.status(200).json({
      success: true,
      message: 'Anime updated successfully',
      data: updatedAnime,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update anime',
    });
  }
};

export const deleteAnime: RequestHandler = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      throw new Error('Anime not found');
    }

    if (anime.trailerUrl && fs.existsSync(anime.trailerUrl)) {
      fs.unlinkSync(anime.trailerUrl); // Delete trailer file
    }

    await deleteAnimeFiles(anime);
    await Anime.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Anime deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete anime',
    });
  }
};
