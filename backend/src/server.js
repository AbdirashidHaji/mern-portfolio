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
  origin: true, // Allow all origins in production for easier debugging, or set to specific URL
  credentials: true
}));

// Security
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for easier deployment of assets
}));

// Request Sanitization (Simple version for serverless)
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (key.startsWith('$')) delete req.body[key];
    }
  }
  next();
});

// Rate limiting (Disabled for API routes in serverless to avoid state issues, or use smaller limits)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
if (process.env.NODE_ENV !== 'production') {
  app.use('/api', limiter);
}

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverless: true });
});

// Middleware to connect to DB on every request if not connected
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorHandler);

// Only listen if running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    initAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
} else {
  // In production (Vercel), we just export. 
  // We should probably run initAdmin periodically or via a separate script, 
  // but for now, let's just ensure DB is connected.
  connectDB();
}

export default app;