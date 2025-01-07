import mongoose from 'mongoose';

const studioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Studio = mongoose.model('Studio', studioSchema);
