import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Genre = mongoose.model('Genre', genreSchema);
