import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
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

console.log('🔧 Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MongoDB URI present:', !!process.env.MONGODB_URI);
console.log('- MongoDB URI starts with:', process.env.MONGODB_URI?.substring(0, 30) + '...');

const app = express();

// Body parser FIRST
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// THEN CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// THEN security middleware
app.use(helmet());

// Custom sanitize middleware to avoid the issue
app.use((req, res, next) => {
  // Sanitize request body
  if (req.body) {
    sanitizeObject(req.body);
  }

  // Sanitize request query
  if (req.query) {
    sanitizeObject(req.query);
  }

  next();
});

function sanitizeObject(obj) {
  const mongoPattern = /^\$/;
  for (const key in obj) {
    if (mongoPattern.test(key)) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// Remove xss-clean if causing issues or replace with alternative
// app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP'
  }
});
app.use('/api', limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use(errorHandler);

// Start server
const isProduction = process.env.NODE_ENV === 'production';

const startServer = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    await connectDB();
    console.log('✅ Database connected, initializing admin...');
    await initAdmin();

    if (!isProduction) {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
        console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Full error:', error);
    if (!isProduction) process.exit(1);
  }
};

startServer();

export default app;