import ApiError from '../utils/apiError.js';

const VALID_UNITS = ['pieces', 'kg', 'g', 'l', 'ml', 'cups', 'tbsp', 'tsp'];
const VALID_CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Spices', 'Other'];

export const validatePantryItem = (req, res, next) => {
  const { name, quantity, unit, category, expiry_date } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Item name is required' });
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

  if (expiry_date && isNaN(Date.parse(expiry_date))) {
    errors.push({ field: 'expiry_date', message: 'Expiry date must be a valid date format' });
  }

  if (errors.length > 0) {
    return next(new ApiError('Validation Error', 400, errors));
  }

  next();
};
