import { useState, useEffect } from "react";
import { Plus, X, ChefHat, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import { format, startOfWeek, addDays } from "date-fns";
import { mealPlanService } from "../services/mealPlanService";
import { recipeService } from "../services/recipeService";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"];
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MealPlanner = () => {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Confirm Modal state
  const [deleteMealId, setDeleteMealId] = useState(null);

  useEffect(() => {
    loadMealPlanAndRecipes();
  }, [weekStart]);

  const loadMealPlanAndRecipes = async () => {
    const startDate = format(weekStart, "yyyy-MM-dd");
    const endDate = format(addDays(weekStart, 6), "yyyy-MM-dd");

    try {
      setLoading(true);
      const [plansRes, recipesRes] = await Promise.all([
        mealPlanService.getMealPlans(startDate, endDate),
        recipeService.getRecipes(),
      ]);

      if (plansRes.success) {
        const organized = {};
        plansRes.data.forEach((meal) => {
          const dateKey = meal.meal_date;
          if (!organized[dateKey]) {
            organized[dateKey] = {};
          }
          const recipeName = meal.recipe?.name || "Recipe";
          organized[dateKey][meal.meal_type] = {
            ...meal,
            id: meal._id,
            recipe_name: recipeName,
          };
        });
        setMealPlan(organized);
      }

      if (recipesRes.success) {
        setRecipes(recipesRes.data.map((r) => ({ ...r, id: r._id })));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load meal plan");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = (date, mealType) => {
    setSelectedSlot({ date, mealType });
    setShowAddModal(true);
  };

  const confirmRemoveMeal = async () => {
    if (!deleteMealId) return;

    try {
      const res = await mealPlanService.deleteMealPlan(deleteMealId);
      if (res.success) {
        toast.success("Meal removed from schedule");
        loadMealPlanAndRecipes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove meal");
    } finally {
      setDeleteMealId(null);
    }
  };

  const getDayMeals = (dayIndex) => {
    const date = format(addDays(weekStart, dayIndex), "yyyy-MM-dd");
    return mealPlan[date] || {};
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              Weekly <span className="text-gradient">Meal Planner</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Schedule gourmet meals and plan your weekly menu</p>
          </div>

          {/* Week Controls */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Previous Week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setWeekStart(startOfWeek(new Date()))}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              This Week
            </button>
            <button
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Next Week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Week Banner */}
        <div className="glass-panel rounded-2xl p-4 mb-8 text-center border border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Calendar Window</p>
          <p className="text-lg font-extrabold text-white font-heading mt-0.5">
            {format(weekStart, "MMMM d")} – {format(addDays(weekStart, 6), "MMMM d, yyyy")}
          </p>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading meal plan calendar...</div>
        ) : (
          <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
            {/* Header Row */}
            <div className="grid grid-cols-8 border-b border-slate-800 bg-slate-900/60">
              <div className="p-4 font-bold text-xs text-slate-400 uppercase tracking-wider border-r border-slate-800">
                Meal Slot
              </div>
              {DAYS_OF_WEEK.map((day, index) => (
                <div
                  key={day}
                  className="p-4 text-center border-r border-slate-800 last:border-r-0"
                >
                  <div className="font-bold text-white text-xs">{day}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {format(addDays(weekStart, index), "MMM d")}
                  </div>
                </div>
              ))}
            </div>

            {/* Meal Rows */}
            {MEAL_TYPES.map((mealType) => (
              <div
                key={mealType}
                className="grid grid-cols-8 border-b border-slate-800/80 last:border-b-0"
              >
                <div className="p-4 font-bold text-xs text-emerald-400 uppercase tracking-wider border-r border-slate-800 bg-slate-900/40 flex items-center">
                  {mealType}
                </div>
                {DAYS_OF_WEEK.map((_, dayIndex) => {
                  const date = format(addDays(weekStart, dayIndex), "yyyy-MM-dd");
                  const dayMeals = getDayMeals(dayIndex);
                  const meal = dayMeals[mealType];

                  return (
                    <div
                      key={dayIndex}
                      className="p-2.5 border-r border-slate-800/80 last:border-r-0 min-h-24 hover:bg-slate-900/40 transition-colors"
                    >
                      {meal ? (
                        <div className="relative group h-full">
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 h-full flex flex-col justify-between">
                            <p className="text-xs font-bold text-emerald-300 line-clamp-2 leading-snug">
                              {meal.recipe_name}
                            </p>
                            <button
                              onClick={() => setDeleteMealId(meal.id || meal._id)}
                              className="absolute top-1.5 right-1.5 p-1 bg-slate-950 text-slate-400 hover:text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddMeal(date, mealType)}
                          className="w-full h-full border border-dashed border-slate-800 hover:border-emerald-500/40 rounded-xl flex items-center justify-center text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all group"
                        >
                          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove Meal Modal */}
      <ConfirmModal
        isOpen={!!deleteMealId}
        onClose={() => setDeleteMealId(null)}
        onConfirm={confirmRemoveMeal}
        title="Remove Scheduled Meal"
        message="Are you sure you want to remove this recipe from your weekly meal plan?"
        confirmText="Remove Meal"
        variant="warning"
      />

      {/* Add Meal Modal */}
      {showAddModal && selectedSlot && (
        <AddMealModal
          date={selectedSlot.date}
          mealType={selectedSlot.mealType}
          recipes={recipes}
          onClose={() => {
            setShowAddModal(false);
            setSelectedSlot(null);
          }}
          onSuccess={() => {
            loadMealPlanAndRecipes();
            setShowAddModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};

const AddMealModal = ({ date, mealType, recipes, onClose, onSuccess }) => {
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRecipe) {
      toast.error("Please select a recipe");
      return;
    }

    setLoading(true);
    try {
      const res = await mealPlanService.addMealPlan(
        selectedRecipe,
        date,
        mealType
      );
      if (res.success) {
        toast.success("Meal scheduled successfully");
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass-panel rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Schedule Meal</h2>
            <p className="text-xs text-slate-400 capitalize mt-0.5">
              {format(new Date(date), "EEEE, MMM d")} • <span className="text-emerald-400 font-bold">{mealType}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipe collection..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-xs"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar pr-1">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <label
                  key={recipe.id || recipe._id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                    selectedRecipe === (recipe.id || recipe._id)
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 text-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="recipe"
                    value={recipe.id || recipe._id}
                    checked={selectedRecipe === (recipe.id || recipe._id)}
                    onChange={(e) => setSelectedRecipe(e.target.value)}
                    className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-100 truncate">{recipe.name}</p>
                    {recipe.cuisine_type && (
                      <p className="text-[11px] text-slate-500">{recipe.cuisine_type}</p>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <div className="text-center py-8">
                <ChefHat className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No saved recipes found</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-900 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedRecipe}
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Schedule Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealPlanner;
