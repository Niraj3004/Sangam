import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { env } from './config/env.config';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middlewares/error';
import { createServer } from 'http';
import { initSocket } from './socket';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Routes
app.use('/api', routes);

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error Handling (Must be last)
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  
  httpServer.listen(env.PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
  });
};

startServer();
