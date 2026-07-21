import Recipe from '../models/Recipe.js';
import PantryItem from '../models/PantryItem.js';
import MealPlan from '../models/MealPlan.js';

// @desc    Get dashboard metrics, recent recipes, and upcoming meals
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Expiry date range (today to 7 days later)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999);

    const todayIsoStr = today.toISOString().split('T')[0];

    const [
      totalRecipes,
      pantryItemsCount,
      expiringSoonCount,
      mealsThisWeekCount,
      recentRecipes,
      upcomingMeals,
    ] = await Promise.all([
      Recipe.countDocuments({ user: userId }),
      PantryItem.countDocuments({ user: userId }),
      PantryItem.countDocuments({
        user: userId,
        expiry_date: { $gte: today, $lte: sevenDaysLater },
      }),
      MealPlan.countDocuments({
        user: userId,
        meal_date: { $gte: todayIsoStr },
      }),
      Recipe.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      MealPlan.find({
        user: userId,
        meal_date: { $gte: todayIsoStr },
      })
        .populate('recipe', 'name description image_url prep_time cook_time')
        .sort({ meal_date: 1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRecipes,
        pantryItems: pantryItemsCount,
        mealsThisWeek: mealsThisWeekCount,
        expiringSoonCount,
      },
      recentRecipes,
      upcomingMeals,
    });
  } catch (error) {
    next(error);
  }
};
