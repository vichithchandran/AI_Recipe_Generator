import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, ChefHat, Trash2, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import DietSymbol from "../components/DietSymbol";
import toast from "react-hot-toast";
import { recipeService } from "../services/recipeService";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);

  // Confirm Modal state
  const [deleteRecipeId, setDeleteRecipeId] = useState(null);

  const cuisines = [
    "All",
    "Italian",
    "Mexican",
    "Indian",
    "Chinese",
    "Japanese",
    "Thai",
    "French",
    "Mediterranean",
    "American",
  ];
  const difficulties = ["All", "easy", "medium", "hard"];

  useEffect(() => {
    fetchRecipes();
  }, [searchQuery, selectedCuisine, selectedDifficulty]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await recipeService.getRecipes(
        searchQuery,
        selectedCuisine,
        selectedDifficulty
      );
      if (res.success) {
        setRecipes(res.data.map((r) => ({ ...r, id: r._id })));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteRecipeId) return;

    try {
      const res = await recipeService.deleteRecipe(deleteRecipeId);
      if (res.success) {
        toast.success("Recipe deleted");
        setRecipes(recipes.filter((r) => r.id !== deleteRecipeId && r._id !== deleteRecipeId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete recipe");
    } finally {
      setDeleteRecipeId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              My <span className="text-gradient">Recipe Collection</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Browse and filter saved recipes with Veg & Non-Veg indicators</p>
          </div>
          <Link
            to="/generate"
            className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Generate New Recipe
          </Link>
        </div>

        {/* Search & Filters Bar */}
        <div className="glass-panel rounded-2xl p-4 mb-8 border border-slate-800/80">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipe title or ingredient..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm"
              />
            </div>

            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm font-medium"
            >
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine === "All" ? "All Cuisines" : cuisine}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm font-medium"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === "All"
                    ? "All Difficulties"
                    : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading saved recipes...</div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id || recipe._id}
                recipe={recipe}
                onDelete={(id) => setDeleteRecipeId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-16 text-center border border-slate-800/80">
            <ChefHat className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-sm mb-4">
              {searchQuery || selectedCuisine !== "All" || selectedDifficulty !== "All"
                ? "No recipes match your search filters"
                : "No saved recipes in your collection"}
            </p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-all"
            >
              Generate Your First Recipe
            </Link>
          </div>
        )}
      </div>

      {/* Delete Recipe Modal */}
      <ConfirmModal
        isOpen={!!deleteRecipeId}
        onClose={() => setDeleteRecipeId(null)}
        onConfirm={confirmDelete}
        title="Delete Saved Recipe"
        message="Are you sure you want to delete this recipe from your collection?"
        confirmText="Delete Recipe"
        variant="danger"
      />
    </div>
  );
};

const RecipeCard = ({ recipe, onDelete }) => {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden hover:border-emerald-500/30 transition-all glass-panel-hover flex flex-col justify-between group">
      <div>
        {/* Banner Graphic / Image */}
        <div className="h-44 bg-linear-to-br from-slate-900 via-emerald-950/30 to-slate-950 border-b border-slate-800 flex items-center justify-center relative overflow-hidden">
          {recipe.image_url || recipe.imageUrl ? (
            <img
              src={recipe.image_url || recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChefHat className="w-10 h-10 text-emerald-400" />
            </div>
          )}
          {recipe.cuisine_type && (
            <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-emerald-400 rounded-lg text-[11px] font-bold z-10">
              {recipe.cuisine_type}
            </span>
          )}
        </div>

        {/* Recipe Info */}
        <div className="p-6">
          <Link to={`/recipes/${recipe.id || recipe._id}`} className="block mb-3">
            <div className="flex items-center gap-2">
              <DietSymbol
                name={recipe.name}
                tags={recipe.dietary_tags || []}
                ingredients={recipe.ingredients || []}
                className="w-4 h-4 mt-0.5"
              />
              <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-400 transition-colors font-heading line-clamp-2">
                {recipe.name}
              </h3>
            </div>
            {recipe.description && (
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>
            )}
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.difficulty && (
              <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold capitalize">
                {recipe.difficulty}
              </span>
            )}
            {recipe.dietary_tags &&
              recipe.dietary_tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded text-[11px] font-semibold"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Footer Meta & Actions */}
      <div className="px-6 pb-6 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800/60 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{totalTime} mins</span>
          </div>
          {recipe.calories && <span>{recipe.calories} kcal</span>}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/recipes/${recipe.id || recipe._id}`}
            className="flex-1 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-800 text-center py-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onDelete(recipe.id || recipe._id)}
            className="px-3 py-2.5 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl transition-all"
            title="Delete Recipe"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
