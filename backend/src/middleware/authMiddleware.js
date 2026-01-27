import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized to access this route' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminUser.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        error: 'Admin user no longer exists' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired. Please login again.' 
      });
    }
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    return next();
  }
  res.status(403).json({ 
    success: false,
    error: 'Access denied. Admin privileges required.' 
  });
};