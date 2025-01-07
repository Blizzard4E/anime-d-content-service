import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/config';
import { registerSchema, loginSchema } from '../validation/auth.schema';

export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log('registering..');
    const validatedData = registerSchema.parse(req.body);
    const user = new User(validatedData);
    await user.save();

    const token = jwt.sign({ userId: user._id }, config.jwtSecret);
    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await User.findOne({ email: validatedData.email });

    if (!user || !(await user.comparePassword(validatedData.password))) {
      res.status(401).json({ error: 'Invalid login credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret);
    res.json({ user, token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};
