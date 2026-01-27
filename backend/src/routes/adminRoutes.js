import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';

const router = express.Router();

router.get('/stats', protect, isAdmin, async (req, res, next) => {
  try {
    const [totalProjects, featuredProjects, totalSkills] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Skill.countDocuments()
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        featuredProjects,
        totalSkills,
        lastLogin: req.admin.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;