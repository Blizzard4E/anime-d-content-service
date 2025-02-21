// utils/file-cleanup.ts
import fs from 'fs';
import path from 'path';

export const deleteFile = async (filepath: string) => {
  try {
    if (fs.existsSync(filepath)) {
      await fs.promises.unlink(filepath);
    }
  } catch (error) {
    console.error(`Error deleting file ${filepath}:`, error);
  }
};

export const deleteAnimeFiles = async (anime: any) => {
  const filesToDelete = [anime.posterUrl, anime.coverUrl, anime.logoUrl, anime.trailerUrl].filter(Boolean);

  for (const file of filesToDelete) {
    await deleteFile(file);
  }
};
