import Recipe from '../models/Recipe.js';
import PantryItem from '../models/PantryItem.js';
import ApiError from '../utils/apiError.js';
import { generateRecipeFromAI } from '../services/aiService.js';

// @desc    Get all user saved recipes
// @route   GET /api/recipes
// @access  Private
export const getRecipes = async (req, res, next) => {
  try {
    const { search, cuisine, difficulty, limit } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisine_type = cuisine;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    let recipeQuery = Recipe.find(query).sort({ createdAt: -1 });

    if (limit) {
      recipeQuery = recipeQuery.limit(parseInt(limit, 10));
    }

    const recipes = await recipeQuery;

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Private
export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });

    if (!recipe) {
      return next(new ApiError('Recipe not found', 404));
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a new recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req, res, next) => {
  try {
    const recipeData = {
      ...req.body,
      user: req.user._id,
    };

    const recipe = await Recipe.create(recipeData);

    res.status(201).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI recipe (Restricts expired pantry items)
// @route   POST /api/recipes/generate
// @access  Private
export const generateRecipe = async (req, res, next) => {
  try {
    let { ingredients = [], usePantry, cuisineType, dietaryRestrictions, servings, cookingTime } = req.body;

    if (!Array.isArray(ingredients)) {
      ingredients = [];
    }

    if (usePantry) {
      const now = new Date();
      // Filter out expired items: only include items with no expiry date or expiry_date >= today
      const validPantryItems = await PantryItem.find({
        user: req.user._id,
        $or: [
          { expiry_date: { $exists: false } },
          { expiry_date: null },
          { expiry_date: { $gte: now } },
        ],
      });
      const pantryNames = validPantryItems.map((item) => item.name);
      ingredients = [...new Set([...ingredients, ...pantryNames])];
    }

    if (ingredients.length === 0) {
      return next(
        new ApiError(
          usePantry
            ? 'No valid, non-expired pantry items found. Please add fresh ingredients!'
            : 'Please add at least one ingredient',
          400
        )
      );
    }

    const generatedRecipe = await generateRecipeFromAI({
      ingredients,
      cuisineType,
      dietaryRestrictions,
      servings,
      cookingTime,
    });

    res.status(200).json({
      success: true,
      data: generatedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a saved recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });

    if (!recipe) {
      return next(new ApiError('Recipe not found', 404));
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
