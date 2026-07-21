import ApiError from '../utils/apiError.js';

const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const validateMealPlan = (req, res, next) => {
  const { recipe_id, meal_date, meal_type } = req.body;
  const errors = [];

  if (!recipe_id) {
    errors.push({ field: 'recipe_id', message: 'Recipe ID is required' });
  }

  if (!meal_date || !DATE_REGEX.test(meal_date)) {
    errors.push({ field: 'meal_date', message: 'Meal date must be in YYYY-MM-DD format' });
  }

  if (!meal_type || !VALID_MEAL_TYPES.includes(meal_type)) {
    errors.push({ field: 'meal_type', message: `Meal type must be one of: ${VALID_MEAL_TYPES.join(', ')}` });
  }

  if (errors.length > 0) {
    return next(new ApiError('Validation Error', 400, errors));
  }

  next();
};
