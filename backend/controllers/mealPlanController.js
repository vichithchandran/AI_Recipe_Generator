import MealPlan from '../models/MealPlan.js';
import Recipe from '../models/Recipe.js';
import ApiError from '../utils/apiError.js';

// @desc    Get meal plans for a date range
// @route   GET /api/meal-plans
// @access  Private
export const getMealPlans = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.meal_date = { $gte: startDate, $lte: endDate };
    }

    const mealPlans = await MealPlan.find(query)
      .populate('recipe', 'name description image_url prep_time cook_time')
      .sort({ meal_date: 1 });

    res.status(200).json({
      success: true,
      count: mealPlans.length,
      data: mealPlans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a recipe to meal plan
// @route   POST /api/meal-plans
// @access  Private
export const addMealPlan = async (req, res, next) => {
  try {
    const { recipe_id, meal_date, meal_type } = req.body;

    const recipe = await Recipe.findOne({ _id: recipe_id, user: req.user._id });
    if (!recipe) {
      return next(new ApiError('Recipe not found', 404));
    }

    // Remove existing meal for the same date & meal type if exists
    await MealPlan.deleteOne({
      user: req.user._id,
      meal_date,
      meal_type,
    });

    const mealPlan = await MealPlan.create({
      user: req.user._id,
      recipe: recipe_id,
      meal_date,
      meal_type,
    });

    const populatedMealPlan = await MealPlan.findById(mealPlan._id).populate(
      'recipe',
      'name description image_url prep_time cook_time'
    );

    res.status(201).json({
      success: true,
      data: populatedMealPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meal plan entry
// @route   DELETE /api/meal-plans/:id
// @access  Private
export const deleteMealPlan = async (req, res, next) => {
  try {
    const mealPlan = await MealPlan.findOne({ _id: req.params.id, user: req.user._id });

    if (!mealPlan) {
      return next(new ApiError('Meal plan entry not found', 404));
    }

    await MealPlan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Meal removed from plan successfully',
    });
  } catch (error) {
    next(error);
  }
};
