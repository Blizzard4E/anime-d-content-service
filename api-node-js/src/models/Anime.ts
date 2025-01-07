import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    posterUrl: { type: String, required: true },
    coverUrl: { type: String, required: true },
    logoUrl: { type: String, required: true },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    studio: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio', required: true },
    description: { type: String, required: true },
    releaseDate: { type: String, required: true },
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
    trailerUrl: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const Anime = mongoose.model('Anime', animeSchema);
