import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
import initAdmin from './utils/initAdmin.js';

dotenv.config();

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Security
app.use(helmet({
  contentSecurityPolicy: false,
}));

// DB Connection Middleware - MUST be before routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
});

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check (no DB needed usually, but the middleware above will check it)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverless: true });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// Background initialization
const initialize = async () => {
  try {
    await connectDB();
    await initAdmin();
    console.log('✅ Initialization complete');
  } catch (err) {
    console.error('❌ Initialization failed:', err.message);
  }
};

// Start server or export
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  initialize().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
} else {
  // In Vercel, we trigger initialization but don't block the export
  // The middleware above handles ensuring DB is connected for requests
  initialize();
}

export default app;