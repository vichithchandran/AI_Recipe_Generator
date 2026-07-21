import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  generateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { validateRecipe } from '../validators/recipeValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getRecipes);
router.post('/generate', generateRecipe);
router.get('/:id', getRecipeById);
router.post('/', validateRecipe, createRecipe);
router.delete('/:id', deleteRecipe);

export default router;
