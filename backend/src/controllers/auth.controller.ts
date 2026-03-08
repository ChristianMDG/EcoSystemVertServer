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
    const { token } = await AuthService.login(email, password);
    return res.json({ message: 'Login successful', token });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};