import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { config } from './config/config';

import authRoutes from './routes/auth.routes';
import animeRoutes from './routes/anime.routes';
import episodeRoutes from './routes/episode.routes';
import genreRoutes from './routes/genre.routes';
import studioRoutes from './routes/studio.routes';
import dashboardRoutes from './routes/dashboard.routes';

// Initialize express
const app = express();

// size
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(
  '/uploads',
  (req, res, next) => {
    console.log('Static file request:', req.path);
    next();
  },
  express.static(path.join(__dirname, '..', 'uploads')),
);

// Routes
app.use('/auth', authRoutes);
app.use('/anime', animeRoutes);
app.use('/episodes', episodeRoutes);
app.use('/genres', genreRoutes);
app.use('/studios', studioRoutes);
app.use('/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');

    // Start server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
