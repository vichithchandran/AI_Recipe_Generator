import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Clock, Users, ArrowLeft, Trash2 } from "lucide-react";
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

  // Confirm modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [id]);

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

  const adjustQuantity = (originalQty, originalServings) => {
    return ((originalQty * servings) / originalServings).toFixed(2);
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

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const originalServings = recipe.servings || 4;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipe Collection
        </Link>

        {/* Recipe Hero Card */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 mb-8 shadow-2xl">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
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
                  className="w-5 h-5"
                />
                <h1 className="text-3xl font-extrabold text-white font-heading">
                  {recipe.name}
                </h1>
              </div>
              {recipe.description && (
                <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-2xl">{recipe.description}</p>
              )}
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all"
              title="Delete Recipe"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-slate-400 font-medium pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-bold">{totalTime} minutes total</span>
            </div>
            {recipe.prep_time && <div>Prep: {recipe.prep_time} mins</div>}
            {recipe.cook_time && <div>Cook: {recipe.cook_time} mins</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients Adjuster Side Panel */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <h2 className="text-base font-bold text-white font-heading">Ingredients</h2>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>Adjust Servings</span>
                </div>
              </div>

              {/* Servings Adjuster */}
              <div className="mb-6 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors"
                >
                  −
                </button>
                <span className="text-base font-extrabold text-white">
                  {servings} {servings === 1 ? "Serving" : "Servings"}
                </span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Ingredients Checklist */}
              <div className="space-y-2.5">
                {recipe.ingredients &&
                  recipe.ingredients.map((ingredient, index) => {
                    const adjustedQty = adjustQuantity(
                      ingredient.quantity,
                      originalServings
                    );
                    const isChecked = checkedIngredients.has(index);

                    return (
                      <label
                        key={index}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-900/60 transition-colors cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIngredient(index)}
                          className="mt-0.5 w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500"
                        />
                        <span
                          className={`flex-1 ${isChecked ? "line-through text-slate-600" : "text-slate-200"}`}
                        >
                          <span className="font-bold text-emerald-400">{adjustedQty} {ingredient.unit}</span>{" "}
                          <span>{ingredient.name}</span>
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Main Recipe Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4">
              <h2 className="text-base font-bold text-white font-heading">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions &&
                  recipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-3 text-xs text-slate-300">
                      <span className="shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <p className="pt-1 leading-relaxed flex-1">{step}</p>
                    </li>
                  ))}
              </ol>
            </div>

            {/* Nutrition Card */}
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
  <div className="text-center p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
    <div className="text-base font-extrabold text-white">
      {value} <span className="text-xs font-normal text-emerald-400">{unit}</span>
    </div>
    <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
  </div>
);

export default RecipeDetail;
