import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import { env } from './config/env';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

declare global {
  namespace Express {
    interface Request { user?: any; }
  }
}

export const app: Application = express();
app.use("/uploads", express.static("uploads"));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(authRoutes);
app.use(productRoutes);
app.use(orderRoutes);



app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

app.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Profile info', user: req.user });
});