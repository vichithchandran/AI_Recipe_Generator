import ApiError from '../utils/apiError.js';

export const validateRecipe = (req, res, next) => {
  const { name, instructions, ingredients } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Recipe name is required' });
  }

  if (!instructions || !Array.isArray(instructions) || instructions.length === 0) {
    errors.push({ field: 'instructions', message: 'At least one instruction step is required' });
  }

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    errors.push({ field: 'ingredients', message: 'At least one ingredient is required' });
  } else {
    ingredients.forEach((ing, index) => {
      if (!ing.name || ing.quantity === undefined || !ing.unit) {
        errors.push({ field: `ingredients[${index}]`, message: 'Ingredient name, quantity, and unit are required' });
      }
    });
  }

  if (errors.length > 0) {
    return next(new ApiError('Validation Error', 400, errors));
  }

  next();
};
