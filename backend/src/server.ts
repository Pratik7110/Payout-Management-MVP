import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth';
import vendorRoutes from './routes/vendors';
import payoutRoutes from './routes/payouts';
import seedRoutes from './routes/seed';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/seed', seedRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Payout Management API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    status: 404,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`, {
    environment: env.NODE_ENV,
    apiDocs: `http://localhost:${PORT}/api-docs`,
  });
});

export default app;
