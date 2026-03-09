import { env } from './config/env';
import { app } from './app';


const PORT = env.PORT;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port  http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
