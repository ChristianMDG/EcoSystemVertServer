import { PrismaClient } from '@prisma/client';
import { config } from './env';

// PrismaClient est attaché au global object en développement pour éviter
// plusieurs connexions pendant le hot reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
});

if (config.isDevelopment) globalForPrisma.prisma = prisma;

// Fonction pour tester la connexion à la base de données
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Fonction pour déconnecter proprement
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log('📦 Database disconnected');
};