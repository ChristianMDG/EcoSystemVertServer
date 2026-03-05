import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler, AppError } from './middlewares/errorHandler';
import { logger } from './utils/logger';

export const app: Application = express();

// Middlewares de base
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Route de santé
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'EcoVert Mada API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Routes API (seront ajoutées progressivement)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// etc.

// Route 404 pour les routes non trouvées
app.use('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware (doit être en dernier)
app.use(errorHandler);