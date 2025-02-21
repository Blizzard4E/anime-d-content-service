// src/controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import { Anime } from '../models/Anime';
import { Episode } from '../models/Episode';
import { User } from '../models/User'; // Make sure you have User model

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use Promise.all to run queries concurrently
    const [totalAnime, totalEpisodes, totalUsers] = await Promise.all([
      Anime.countDocuments(),
      Episode.countDocuments(),
      User.countDocuments(),
    ]);

    // Optional: Get some recent data
    const recentAnime = await Anime.find().sort({ createdAt: -1 }).limit(5).select('title posterUrl status');

    const stats = {
      totals: {
        anime: totalAnime,
        episodes: totalEpisodes,
        users: totalUsers,
      },
      recent: {
        anime: recentAnime,
      },
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
    });
  }
};
