// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { env } from '../config/env';

// const prisma = new PrismaClient();
// const SALT_ROUNDS = 10;

// export class AuthService {
//   static async register(name: string, email: string, password: string) {
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) throw new Error('Email already registered');

//     const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

//     const user = await prisma.user.create({
//       data: { name, email, password: hashedPassword },
//     });

//     return user;
//   }

//   static async login(email: string, password: string) {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) throw new Error('Invalid credentials');

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) throw new Error('Invalid credentials');

//     // Créer JWT avec role et createdAt
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         role: user.role
//       },
//       env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     return { user, token };
//   }
// }

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export class AuthService {

  // REGISTER : role = client par défaut
  static async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'client' },
    });

    return user;
  }

  // LOGIN : access + refresh token
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return { user, accessToken, refreshToken };
  }

  // REFRESH TOKEN
  static async refresh(refreshToken: string) {
    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken || storedToken.revoked) throw new Error('Invalid refresh token');

    const decoded: any = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revoked: true }
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // LOGOUT
  static async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true }
    });
  }
}