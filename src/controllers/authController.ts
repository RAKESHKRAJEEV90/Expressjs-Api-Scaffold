import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from '../utils/AppError';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });
  res.status(201).json({ user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid credentials', 401);

  const payload = { id: user._id, role: user.role };
  const token = jwt.sign(payload as any, config.JWT_SECRET as unknown as jwt.Secret, { expiresIn: config.JWT_EXPIRES_IN as any });
  res.json({ token });
}; 