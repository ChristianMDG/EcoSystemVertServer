import express, { Application, Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import cors from 'cors';
import { env } from './config/env';
// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust type as needed based on your user object
    }
  }
}

export const app: Application = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(authRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is healthy',
  })
});

app.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Profile info', user: req.user });
});