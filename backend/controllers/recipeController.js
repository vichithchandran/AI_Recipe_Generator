import Recipe from '../models/Recipe.js';
import PantryItem from '../models/PantryItem.js';
import ApiError from '../utils/apiError.js';
import { generateRecipeFromAI, fetchIngredientsFromAI, calculateNutritionFromAI } from '../services/aiService.js';

// Helper to deduplicate recipes in MongoDB and purge test recipes
const deduplicateRecipes = async (recipeList) => {
  try {
    // 1. Purge any test/sample/demo recipes directly from MongoDB
    await Recipe.deleteMany({
      name: { $regex: /test|sample|demo/i },
    });
  } catch (e) {
    console.error('Test recipe cleanup error:', e);
  }

  if (!Array.isArray(recipeList) || recipeList.length === 0) return [];

  // Filter out any deleted test recipes from memory
  const cleanList = recipeList.filter((recipe) => {
    const nameStr = String(recipe.name || '').toLowerCase();
    return (
      !nameStr.includes('test') &&
      !nameStr.includes('sample') &&
      !nameStr.includes('demo')
    );
  });

  if (cleanList.length <= 1) return cleanList;

  // 2. Deduplicate remaining recipes (keeps the one with image_url and deletes duplicates)
  const grouped = new Map();
  const idsToDelete = [];

  for (const recipe of cleanList) {
    const key = String(recipe.name || '').toLowerCase().trim();
    if (!key) continue;

    if (!grouped.has(key)) {
      grouped.set(key, recipe);
    } else {
      const existing = grouped.get(key);
      const incomingHasImage = !!(recipe.image_url || recipe.imageUrl);
      const existingHasImage = !!(existing.image_url || existing.imageUrl);

      if (incomingHasImage && !existingHasImage) {
        idsToDelete.push(existing._id);
        grouped.set(key, recipe);
      } else {
        idsToDelete.push(recipe._id);
      }
    }
  }

  if (idsToDelete.length > 0) {
    try {
      await Recipe.deleteMany({ _id: { $in: idsToDelete } });
    } catch (e) {
      console.error('Deduplication cleanup error:', e);
    }
  }

  return Array.from(grouped.values());
};



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

    if (cuisine && cuisine !== 'all') {
      query.cuisine_type = cuisine;
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    let recipeQuery = Recipe.find(query).sort({ createdAt: -1 });

    if (limit) {
      recipeQuery = recipeQuery.limit(Number(limit));
    }

    const rawRecipes = await recipeQuery;
    const recipes = await deduplicateRecipes(rawRecipes);

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe details
// @route   GET /api/recipes/:id
// @access  Public / Private
export const getRecipeById = async (req, res, next) => {
  try {
    const query = req.user
      ? { _id: req.params.id, $or: [{ user: req.user._id }, { is_public: { $ne: false } }] }
      : { _id: req.params.id, is_public: { $ne: false } };

    const recipe = await Recipe.findOne(query);

    if (!recipe) {
      return next(new ApiError('Recipe not found or is private', 404));
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / save a recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req, res, next) => {
  try {
    const { is_combo, items } = req.body;
    let ingredients = req.body.ingredients || [];
    let instructions = req.body.instructions || [];
    const name = (req.body.name || '').trim();
    const imageUrl = req.body.image_url || req.body.imageUrl || null;

    // Check if recipe with same name already exists for this user to prevent duplicates
    if (name) {
      const existing = await Recipe.findOne({
        user: req.user._id,
        name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      });

      if (existing) {
        if (imageUrl && !existing.image_url) {
          existing.image_url = imageUrl;
        }
        if (ingredients.length > 0) existing.ingredients = ingredients;
        if (instructions.length > 0) existing.instructions = instructions;
        if (req.body.nutrition) existing.nutrition = req.body.nutrition;
        if (req.body.is_public !== undefined) existing.is_public = req.body.is_public;

        await existing.save();

        return res.status(200).json({
          success: true,
          data: existing,
          message: 'Recipe updated in your collection',
        });
      }
    }

    if (is_combo && Array.isArray(items) && items.length > 0) {
      if (ingredients.length === 0) {
        items.forEach((item) => {
          if (Array.isArray(item.ingredients)) {
            ingredients.push(...item.ingredients);
          }
        });
      }
      if (instructions.length === 0) {
        items.forEach((item) => {
          const prefix = item.name ? `[${item.name}] ` : '';
          if (Array.isArray(item.instructions)) {
            item.instructions.forEach((step) => {
              if (step && step.trim()) {
                instructions.push(`${prefix}${step.trim()}`);
              }
            });
          }
        });
      }
    }

    const recipeData = {
      ...req.body,
      ingredients,
      instructions,
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


// @desc    Auto-fetch ingredients for a target dish name
// @route   POST /api/recipes/fetch-ingredients
// @access  Private
export const fetchIngredientsForDish = async (req, res, next) => {
  try {
    const { dishName, cuisineType = 'Any', dietaryRestrictions = [] } = req.body;
    if (!dishName || !dishName.trim()) {
      return next(new ApiError('Please enter a target dish name', 400));
    }

    const ingredients = await fetchIngredientsFromAI(dishName, cuisineType, dietaryRestrictions);
    res.status(200).json({
      success: true,
      data: ingredients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate AI Nutrition for custom recipe
// @route   POST /api/recipes/calculate-nutrition
// @access  Private
export const calculateNutrition = async (req, res, next) => {
  try {
    const { recipeName, ingredients = [], servings = 4 } = req.body;
    const nutrition = await calculateNutritionFromAI(recipeName, ingredients, servings);
    res.status(200).json({
      success: true,
      data: nutrition,
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
    let { ingredients = [], usePantry, cuisineType, dietaryRestrictions, servings, cookingTime, targetDish } = req.body;

    if (!Array.isArray(ingredients)) {
      ingredients = [];
    }

    if (usePantry) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      // Filter out expired items: only include items with no expiry date or expiry_date >= start of today
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

    if (ingredients.length === 0 && (!targetDish || !targetDish.trim())) {
      return next(
        new ApiError(
          usePantry
            ? 'No valid, non-expired pantry items found. Please add fresh ingredients or enter a target dish!'
            : 'Please add at least one ingredient or enter a target dish name',
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
      targetDish,
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

// @desc    Toggle recipe public / private status
// @route   PATCH /api/recipes/:id/toggle-public
// @access  Private
export const togglePublicStatus = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });

    if (!recipe) {
      return next(new ApiError('Recipe not found', 404));
    }

    recipe.is_public = recipe.is_public === false ? true : false;
    await recipe.save();

    res.status(200).json({
      success: true,
      data: recipe,
      message: recipe.is_public ? 'Recipe is now public' : 'Recipe is now private',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all public recipes shared by community users
// @route   GET /api/recipes/public
// @access  Private / Public
export const getPublicRecipes = async (req, res, next) => {
  try {
    const { search, cuisine, difficulty, limit } = req.query;

    const query = { is_public: { $ne: false } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine && cuisine !== 'all' && cuisine !== 'All') {
      query.cuisine_type = cuisine;
    }

    if (difficulty && difficulty !== 'all' && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    let recipeQuery = Recipe.find(query).populate('user', 'name email').sort({ createdAt: -1 });

    if (limit) {
      recipeQuery = recipeQuery.limit(Number(limit));
    }

    const rawRecipes = await recipeQuery;
    const recipes = await deduplicateRecipes(rawRecipes);

    res.status(200).json({

      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clone a public recipe into current user's collection
// @route   POST /api/recipes/:id/clone
// @access  Private
export const cloneRecipe = async (req, res, next) => {
  try {
    const originalRecipe = await Recipe.findOne({ _id: req.params.id, is_public: { $ne: false } });


    if (!originalRecipe) {
      return next(new ApiError('Public recipe not found', 404));
    }

    const clonedData = originalRecipe.toObject();
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;
    delete clonedData.__v;

    clonedData.user = req.user._id;
    clonedData.name = `${clonedData.name} (Saved Copy)`;
    clonedData.is_public = false; // default cloned copy to private

    const clonedRecipe = await Recipe.create(clonedData);

    res.status(201).json({
      success: true,
      data: clonedRecipe,
      message: 'Recipe saved to your collection!',
    });
  } catch (error) {
    next(error);
  }
};


