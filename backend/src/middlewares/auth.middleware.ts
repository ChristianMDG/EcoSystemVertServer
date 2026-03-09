import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

const prisma = new PrismaClient();

const unauthorized = (res: Response, message: string) => {
  res.status(401).json({ message });
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return unauthorized(res, 'No token provided');

  const accessToken = authHeader.split(' ')[1];

  try {
    // Vérifie access token
    const decoded = jwt.verify(accessToken, env.JWT_SECRET) as { userId: string; role: string };

    // Récupère toutes les infos du user depuis la DB
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return unauthorized(res, 'User not found');

    req.user = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };

    next();

  } catch (err: any) {
    // Token expiré → essayer refresh token
    if (err.name === 'TokenExpiredError') {
      const refreshToken = req.headers['x-refresh-token'] as string;
      if (!refreshToken) return unauthorized(res, 'Token expired, no refresh token');

      try {
        // Vérifie que le refresh token existe et n'est pas révoqué
        const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!storedToken || storedToken.revoked) return unauthorized(res, 'Invalid refresh token');

        // Vérifie le refresh token
        const decodedRefresh = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };

        // Récupère le user depuis la DB
        const user = await prisma.user.findUnique({ where: { id: decodedRefresh.userId } });
        if (!user) return unauthorized(res, 'User not found');

        // Génère nouveaux tokens
        const newAccessToken = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ userId: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Révoque l'ancien refresh token
        await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revoked: true } });
        await prisma.refreshToken.create({
          data: { token: newRefreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7*24*60*60*1000) }
        });

        // Envoie les nouveaux tokens dans les headers
        res.setHeader('x-access-token', newAccessToken);
        res.setHeader('x-refresh-token', newRefreshToken);

        // Remplit req.user
        req.user = {
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        };

        next();

      } catch {
        return unauthorized(res, 'Invalid refresh token');
      }
    } else {
      return unauthorized(res, 'Invalid token');
    }
  }
};