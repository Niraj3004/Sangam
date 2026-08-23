import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.config';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middlewares/error';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Error Handling (Must be last)
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
  });
};

startServer();
