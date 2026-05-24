import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import cartRoutes from "./routes/cart.routes";
import { env } from './config/env';
import adminRoutes from "./routes/admin.routes";
declare global {
  namespace Express {
    interface Request { user?: any; }
  }
}

const app: Application = express();

app.use("/uploads", express.static("uploads"));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Montage des routes
app.use(authRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(cartRoutes);
app.use('/api', adminRoutes);


app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();