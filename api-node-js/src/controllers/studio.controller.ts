import { Request, Response } from 'express';
import { Studio } from '../models/Studio';
import { createStudioSchema, updateStudioSchema } from '../validation/studio.schema';

export const createStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createStudioSchema.parse(req.body);
    const studio = new Studio(validatedData);
    await studio.save();

    res.status(201).json({
      success: true,
      message: 'Studio created successfully',
      data: studio,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const studios = await Studio.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Studios retrieved successfully',
      data: studios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve studios',
      error: (error as Error).message,
    });
  }
};

export const getStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const studio = await Studio.findById(req.params.id);

    if (!studio) {
      res.status(404).json({
        success: false,
        message: 'Studio not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Studio retrieved successfully',
      data: studio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve studio',
      error: (error as Error).message,
    });
  }
};

export const updateStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateStudioSchema.parse(req.body);

    const studio = await Studio.findByIdAndUpdate(req.params.id, validatedData, { new: true, runValidators: true });

    if (!studio) {
      res.status(404).json({
        success: false,
        message: 'Studio not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Studio updated successfully',
      data: studio,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update studio',
      error: (error as Error).message,
    });
  }
};

export const deleteStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const studio = await Studio.findByIdAndDelete(req.params.id);

    if (!studio) {
      res.status(404).json({
        success: false,
        message: 'Studio not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Studio deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete studio',
      error: (error as Error).message,
    });
  }
};
