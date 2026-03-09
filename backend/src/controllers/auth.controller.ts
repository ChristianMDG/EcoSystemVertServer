

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthService.register(name, email, password);
    return res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);

    return res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refresh(refreshToken);
    res.json(tokens);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};