import { Request, Response } from 'express';
import { Studio } from '../models/Studio';
import { createStudioSchema, updateStudioSchema } from '../validation/studio.schema';

export const createStudio = async (req: Request, res: Response) => {
  try {
    const validatedData = createStudioSchema.parse(req.body);
    const studio = new Studio(validatedData);
    await studio.save();
    res.status(201).json(studio);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getStudios = async (req: Request, res: Response) => {
  try {
    const studios = await Studio.find();
    res.json(studios);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getStudio = async (req: Request, res: Response) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) {
      res.status(404).json({ error: 'Studio not found' });
      return;
    }
    res.json(studio);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateStudio = async (req: Request, res: Response) => {
  try {
    const validatedData = updateStudioSchema.parse(req.body);
    const studio = await Studio.findByIdAndUpdate(req.params.id, validatedData, { new: true });
    if (!studio) {
      res.status(404).json({ error: 'Studio not found' });
      return;
    }
    res.json(studio);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteStudio = async (req: Request, res: Response) => {
  try {
    const studio = await Studio.findByIdAndDelete(req.params.id);
    if (!studio) {
      res.status(404).json({ error: 'Studio not found' });
      return;
    }
    res.json({ message: 'Studio deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
