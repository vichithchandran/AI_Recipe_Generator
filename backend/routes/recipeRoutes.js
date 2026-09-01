import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  generateRecipe,
  fetchIngredientsForDish,
  calculateNutrition,
  deleteRecipe,
  togglePublicStatus,
  getPublicRecipes,
  cloneRecipe,
} from '../controllers/recipeController.js';
import { validateRecipe } from '../validators/recipeValidator.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly accessible routes (optional auth)
router.get('/public', optionalAuth, getPublicRecipes);
router.get('/:id', optionalAuth, getRecipeById);

// Protected routes requiring authentication
router.use(protect);

router.get('/', getRecipes);
router.post('/generate', generateRecipe);
router.post('/fetch-ingredients', fetchIngredientsForDish);
router.post('/calculate-nutrition', calculateNutrition);
router.post('/', validateRecipe, createRecipe);
router.post('/:id/clone', cloneRecipe);
router.patch('/:id/toggle-public', togglePublicStatus);
router.delete('/:id', deleteRecipe);




export default router;
