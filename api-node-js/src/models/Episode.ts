import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    episodeNumber: { type: String, required: true },
    videoUrl: { type: String },
    duration: { type: Number },
    animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
  },
  { timestamps: true },
);

export const Episode = mongoose.model('Episode', episodeSchema);
