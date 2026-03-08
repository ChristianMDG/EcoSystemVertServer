import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface JwtPayload {
  userId: string;
  name : string;
  email: string;
  role: string;       
  createdAt: string;
}

// Helper pro pour gérer l’Unauthorized
const unauthorized = (res: Response, message: string) => {
  res.status(401).json({ message });
};

// Middleware JWT pro
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded; 
    next();
  } catch {
    unauthorized(res, 'Unauthorized: Invalid token');
  }
};