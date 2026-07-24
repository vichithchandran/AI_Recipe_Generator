import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Clock, Users, ArrowLeft, Trash2, ChefHat, CheckCircle2, Flame, Sparkles, Printer, Video, ExternalLink, Layers, Utensils } from "lucide-react";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import DietSymbol from "../components/DietSymbol";
import toast from "react-hot-toast";
import { recipeService } from "../services/recipeService";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeComboTab, setActiveComboTab] = useState("all");

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        const res = await recipeService.getRecipeById(id);
        if (res.success && res.data) {
          setRecipe(res.data);
          setServings(res.data.servings || 4);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Recipe not found");
        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, navigate]);

  const confirmDelete = async () => {
    try {
      const res = await recipeService.deleteRecipe(id);
      if (res.success) {
        toast.success("Recipe deleted");
        navigate("/recipes");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete recipe");
    }
  };

  const toggleIngredient = (index) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const formatQuantity = (originalQty, originalServings) => {
    if (!originalQty) return "";
    const calc = (originalQty * servings) / originalServings;
    return parseFloat(calc.toFixed(2));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient">
        <Navbar />
        <div className="text-center py-24 text-slate-500 text-sm">Loading recipe details...</div>
      </div>
    );
  }

  if (!recipe) return null;

  const totalTime = (recipe.prep_time || recipe.prepTime || 0) + (recipe.cook_time || recipe.cookTime || 0);
  const originalServings = recipe.servings || 4;
  const cookingTips = recipe.cooking_tips || recipe.cookingTips || [];
  const isComboMeal = recipe.is_combo || (recipe.items && recipe.items.length > 0);

  // Ingredients and Instructions based on activeComboTab selection
  let displayIngredients = recipe.ingredients || [];
  let displayInstructions = recipe.instructions || [];

  if (isComboMeal && activeComboTab !== "all" && typeof activeComboTab === "number") {
    const selectedItem = recipe.items[activeComboTab];
    if (selectedItem) {
      displayIngredients = selectedItem.ingredients || [];
      displayInstructions = selectedItem.instructions || [];
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-16">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation & Actions Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recipe Collection
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              title="Print Recipe"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl text-xs font-medium transition-all cursor-pointer"
              title="Delete Recipe"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Recipe Hero Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 mb-8 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {(recipe.image_url || recipe.imageUrl) && (
              <div className="md:col-span-5 relative w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
                <img
                  src={recipe.image_url || recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
              </div>
            )}

            <div className={`${(recipe.image_url || recipe.imageUrl) ? 'md:col-span-7' : 'md:col-span-12'} space-y-4`}>
              <div className="flex flex-wrap items-center gap-2">
                {isComboMeal && (
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Combo Meal ({recipe.items?.length || 2} Items)
                  </span>
                )}
                {recipe.cuisine_type && (
                  <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold">
                    {recipe.cuisine_type}
                  </span>
                )}
                {recipe.difficulty && (
                  <span className="px-3 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-full text-xs font-semibold capitalize">
                    {recipe.difficulty}
                  </span>
                )}
                {recipe.dietary_tags &&
                  recipe.dietary_tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              <div className="flex items-center gap-3">
                <DietSymbol
                  name={recipe.name}
                  tags={recipe.dietary_tags || []}
                  ingredients={recipe.ingredients || []}
                  className="w-6 h-6 shrink-0"
                />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading leading-tight">
                  {recipe.name}
                </h1>
              </div>

              {recipe.description && (
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{recipe.description}</p>
              )}

              {/* Meta Quick Stats Bar */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{totalTime} mins</div>
                    <div className="text-[10px] text-slate-400">Total Time</div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{servings} Servings</div>
                    <div className="text-[10px] text-slate-400">Servings</div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{recipe.nutrition?.calories || 350} kcal</div>
                    <div className="text-[10px] text-slate-400">Per Serving</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Servings Controller Banner */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Adjust Recipe Servings</h3>
              <p className="text-xs text-slate-400">Ingredient quantities automatically recalculate below</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
            >
              −
            </button>
            <span className="text-sm font-extrabold text-white px-2 min-w-17.5 text-center">
              {servings} {servings === 1 ? "Serving" : "Servings"}
            </span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Combo Meal Items Navigation Bar */}
        {isComboMeal && recipe.items && recipe.items.length > 0 && (
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Combo Meal Dishes ({recipe.items.length})
              </h3>
              <span className="text-[11px] text-slate-400 ml-auto">Click a dish to filter ingredients & instructions</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveComboTab("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeComboTab === "all"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>All Dishes Combined</span>
              </button>

              {recipe.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveComboTab(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeComboTab === idx
                      ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Content Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Ingredients Section (5 Cols on LG) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white font-heading">
                    {typeof activeComboTab === "number" && recipe.items?.[activeComboTab]?.name
                      ? `Ingredients (${recipe.items[activeComboTab].name})`
                      : "Ingredients Checklist"}
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {displayIngredients.length} Items
                </span>
              </div>

              {/* Ingredients List */}
              <div className="space-y-2.5">
                {displayIngredients.map((ingredient, index) => {
                  const adjustedQty = formatQuantity(
                    ingredient.quantity,
                    originalServings
                  );
                  const isChecked = checkedIngredients.has(index);

                  return (
                    <label
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                        isChecked
                          ? "bg-slate-900/40 border-slate-800/60 opacity-60"
                          : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleIngredient(index)}
                        className="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-700 rounded focus:ring-emerald-500 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                        <span className={`font-semibold truncate ${isChecked ? "line-through text-slate-500" : "text-slate-200"}`}>
                          {ingredient.name}
                        </span>
                        <span className="shrink-0 px-2 py-0.5 bg-emerald-500/15 text-emerald-300 font-bold rounded-lg border border-emerald-500/25 text-[11px]">
                          {adjustedQty} {ingredient.unit}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Instructions & Details Section (7 Cols on LG) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Instructions Step Card */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-heading">
                  {typeof activeComboTab === "number" && recipe.items?.[activeComboTab]?.name
                    ? `Instructions (${recipe.items[activeComboTab].name})`
                    : "Step-by-Step Instructions"}
                </h2>
              </div>

              <ol className="space-y-4">
                {displayInstructions.map((step, index) => (
                  <li key={index} className="flex gap-3.5 text-xs text-slate-300 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700/80 transition-colors">
                    <span className="shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </span>
                    <p className="pt-1 leading-relaxed flex-1 text-slate-300">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Video Reference */}
            {(recipe.video_url || recipe.videoUrl) && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60">
                <div className="flex items-center gap-2 mb-3">
                  <Video className="w-5 h-5 text-red-400" />
                  <h3 className="text-sm font-bold text-white font-heading">Video Reference</h3>
                </div>
                <a
                  href={recipe.video_url || recipe.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-bold text-xs hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4 text-red-400" />
                  <span className="truncate max-w-xs">{recipe.video_url || recipe.videoUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            )}

            {/* Cooking Tips (if available) */}
            {cookingTips.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-linear-to-br from-slate-900/90 via-slate-900/50 to-emerald-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white font-heading">Chef's Pro Tips</h3>
                </div>
                <ul className="space-y-2">
                  {cookingTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutrition per Serving */}
            {recipe.nutrition && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
                <h2 className="text-base font-bold text-white font-heading mb-4">Nutrition per Serving</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <NutritionCard label="Calories" value={recipe.nutrition.calories} unit="kcal" />
                  <NutritionCard label="Protein" value={recipe.nutrition.protein} unit="g" />
                  <NutritionCard label="Carbs" value={recipe.nutrition.carbs} unit="g" />
                  <NutritionCard label="Fats" value={recipe.nutrition.fats} unit="g" />
                  <NutritionCard label="Fiber" value={recipe.nutrition.fiber} unit="g" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Saved Recipe"
        message="Are you sure you want to delete this recipe from your collection?"
        confirmText="Delete Recipe"
        variant="danger"
      />
    </div>
  );
};

const NutritionCard = ({ label, value, unit }) => (
  <div className="text-center p-3 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
    <div className="text-base font-extrabold text-white">
      {value} <span className="text-xs font-normal text-emerald-400">{unit}</span>
    </div>
    <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
  </div>
);

export default RecipeDetail;
