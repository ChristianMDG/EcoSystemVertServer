import { app } from './app';
import { config } from './config/env';
import { testDatabaseConnection, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = config.port;

const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    const isDbConnected = await testDatabaseConnection();
    
    if (!isDbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Démarrer le serveur
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 API URL: http://localhost:${PORT}/api`);
      logger.info(`💊 Health check: http://localhost:${PORT}/health`);
    });

    // Gestion de l'arrêt gracieux
    const gracefulShutdown = async () => {
      logger.info('Received shutdown signal. Closing server...');
      
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDatabase();
        process.exit(0);
      });

      // Forcer l'arrêt après 10 secondes
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Écouter les signaux d'arrêt
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    // Gestion des erreurs non capturées
    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled Rejection:', reason);
      gracefulShutdown();
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown();
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();