import express from 'express';
import {
  getMealPlans,
  addMealPlan,
  deleteMealPlan,
} from '../controllers/mealPlanController.js';
import { validateMealPlan } from '../validators/mealPlanValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMealPlans);
router.post('/', validateMealPlan, addMealPlan);
router.delete('/:id', deleteMealPlan);

export default router;
