import express from 'express';
import { 
  getSkills, 
  getSkill, 
  createSkill, 
  updateSkill, 
  deleteSkill 
} from '../controllers/skillController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSkills);
router.get('/:id', getSkill);
router.post('/', protect, isAdmin, createSkill);
router.put('/:id', protect, isAdmin, updateSkill);
router.delete('/:id', protect, isAdmin, deleteSkill);

export default router;