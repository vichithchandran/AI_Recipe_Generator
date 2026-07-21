import ApiError from '../utils/apiError.js';

const VALID_UNITS = ['pieces', 'kg', 'g', 'l', 'ml', 'cups', 'tbsp', 'tsp'];
const VALID_CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Grains', 'Spices', 'Beverages', 'Other'];

export const validateShoppingListItem = (req, res, next) => {
  const { ingredient_name, quantity, unit, category } = req.body;
  const errors = [];

  if (!ingredient_name || typeof ingredient_name !== 'string' || ingredient_name.trim() === '') {
    errors.push({ field: 'ingredient_name', message: 'Ingredient name is required' });
  }

  if (quantity === undefined || quantity === null || isNaN(Number(quantity)) || Number(quantity) < 0) {
    errors.push({ field: 'quantity', message: 'Quantity must be a non-negative number' });
  }

  if (unit && !VALID_UNITS.includes(unit)) {
    errors.push({ field: 'unit', message: `Unit must be one of: ${VALID_UNITS.join(', ')}` });
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    errors.push({ field: 'category', message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` });
  }

  if (errors.length > 0) {
    return next(new ApiError('Validation Error', 400, errors));
  }

  next();
};
