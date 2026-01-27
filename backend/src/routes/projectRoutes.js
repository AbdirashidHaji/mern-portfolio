import express from 'express';
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, isAdmin, createProject);
router.put('/:id', protect, isAdmin, updateProject);
router.delete('/:id', protect, isAdmin, deleteProject);

export default router;