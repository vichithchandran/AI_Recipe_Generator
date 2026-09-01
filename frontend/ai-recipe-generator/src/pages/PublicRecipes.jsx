import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, ChefHat, Sparkles, ArrowRight, Plus, Video, Globe, Share2, Check, Bookmark, Users, Flame, User, Layers } from "lucide-react";
import Navbar from "../components/Navbar";
import DietSymbol from "../components/DietSymbol";
import toast from "react-hot-toast";
import { recipeService } from "../services/recipeService";

const CUISINES = [
  "All",
  "Indian (All Regions)",
  "Kerala",
  "South Indian",
  "Tamil Nadu",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "North Indian",
  "Punjabi",
  "Bengali (West Bengal)",
  "Maharashtrian",
  "Gujarati",
  "Rajasthani",
  "Goan",
  "Kashmiri",
  "Odia (Odisha)",
  "Assamese",
  "Bihari",
  "Hyderabadi",
  "Chettinad",
  "Awadhi / Mughlai",
  "Himachali",
  "Uttarakhand / Kumaoni",
  "Naga",
  "Manipuri",
  "Meghalayan",
  "Sikkimese",
  "Indo-Chinese",
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "French",
  "Mediterranean",
  "American",
  "Other",
];

const DIFFICULTIES = ["All", "easy", "medium", "hard"];

const PublicRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchPublicRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await recipeService.getPublicRecipes(
        searchQuery,
        selectedCuisine,
        selectedDifficulty
      );
      if (res.success) {
        setRecipes(res.data.map((r) => ({ ...r, id: r._id })));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch community recipes");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCuisine, selectedDifficulty]);

  useEffect(() => {
    fetchPublicRecipes();
  }, [fetchPublicRecipes]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-extrabold mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Public Community Landing Page</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              Community <span className="text-gradient">Public Recipes</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Explore culinary creations shared by foodies worldwide. Toggle "Public 🌐" on your recipes to showcase them here!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/recipes"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-bold px-5 py-3 rounded-xl hover:bg-slate-800 transition-all text-xs"
            >
              <ChefHat className="w-4 h-4 text-emerald-400" />
              <span>My Recipe Collection</span>
            </Link>

            <Link
              to="/generate"
              className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Recipe</span>
            </Link>
          </div>
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
                placeholder="Search public recipes by dish name or ingredient..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm"
              />
            </div>

            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 outline-none text-sm font-medium"
            >
              {CUISINES.map((cuisine) => (
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
              {DIFFICULTIES.map((diff) => (
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
          <div className="text-center py-16 text-slate-500 text-sm">Loading community recipes...</div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <PublicRecipeCard key={recipe.id || recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-16 text-center border border-slate-800/80">
            <Globe className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-sm mb-4">
              {searchQuery || selectedCuisine !== "All" || selectedDifficulty !== "All"
                ? "No public recipes match your search criteria"
                : "No recipes have been shared to the public landing page yet."}
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/recipes"
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Share One of Your Saved Recipes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PublicRecipeCard = ({ recipe }) => {
  const [copied, setCopied] = useState(false);
  const [cloning, setCloning] = useState(false);

  const totalTime = (recipe.prep_time || recipe.prepTime || 0) + (recipe.cook_time || recipe.cookTime || 0);
  const isCombo = recipe.is_combo || (recipe.items && recipe.items.length > 0);
  const calories = recipe.nutrition?.calories || recipe.calories || 350;
  const servings = recipe.servings || 4;
  const authorName = recipe.user?.name || "Community Chef";

  const handleShareLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/recipes/${recipe.id || recipe._id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Public share link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloneRecipe = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setCloning(true);
      const res = await recipeService.cloneRecipe(recipe.id || recipe._id);
      if (res.success) {
        toast.success("Recipe saved to your collection!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save recipe");
    } finally {
      setCloning(false);
    }
  };

  const difficultyColors = {
    easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    medium: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    hard: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  };

  return (
    <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 glass-panel-hover flex flex-col justify-between group shadow-xl hover:shadow-emerald-500/10">
      <div>
        {/* Banner Graphic / Image */}
        <div className="h-48 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800/80 flex items-center justify-center relative overflow-hidden">
          {recipe.image_url || recipe.imageUrl ? (
            <img
              src={recipe.image_url || recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <ChefHat className="w-10 h-10 text-emerald-400" />
            </div>
          )}

          {/* Top Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none"></div>

          {/* Top Left Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {isCombo && (
              <span className="px-2.5 py-1 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md">
                <Layers className="w-3 h-3 text-emerald-400" />
                Combo ({recipe.items?.length || 2})
              </span>
            )}
            {(recipe.video_url || recipe.videoUrl) && (
              <span className="px-2.5 py-1 bg-red-950/80 backdrop-blur-md border border-red-500/40 text-red-300 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md">
                <Video className="w-3 h-3 text-red-400" />
                Video
              </span>
            )}
          </div>

          {/* Top Right Cuisine */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {recipe.cuisine_type && (
              <span className="px-2.5 py-1 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-emerald-400 rounded-lg text-[11px] font-extrabold shadow-md">
                {recipe.cuisine_type}
              </span>
            )}
          </div>
        </div>

        {/* Card Info */}
        <div className="p-5 sm:p-6 space-y-3">
          <Link to={`/recipes/${recipe.id || recipe._id}`} className="block group/title">
            <div className="flex items-start gap-2">
              <DietSymbol
                name={recipe.name}
                tags={recipe.dietary_tags || []}
                ingredients={recipe.ingredients || []}
                className="w-4 h-4 mt-1 shrink-0"
              />
              <h3 className="font-extrabold text-base sm:text-lg text-white group-hover/title:text-emerald-400 transition-colors font-heading leading-snug line-clamp-1">
                {recipe.name}
              </h3>
            </div>

            {recipe.description && (
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                {recipe.description}
              </p>
            )}
          </Link>

          {/* Author Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shared by <strong className="text-slate-200">{authorName}</strong></span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-[11px] font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-slate-800/60">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{totalTime} m</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-slate-800/60">
              <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{servings} serv</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-slate-800/60">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{calories} kcal</span>
            </div>
          </div>

          {/* Dietary & Difficulty Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {recipe.difficulty && (
              <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold capitalize ${difficultyColors[recipe.difficulty] || "bg-slate-900 text-slate-300 border-slate-800"}`}>
                {recipe.difficulty}
              </span>
            )}
            {recipe.dietary_tags &&
              recipe.dietary_tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-lg text-[11px] font-medium"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 pt-2">
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
          <Link
            to={`/recipes/${recipe.id || recipe._id}`}
            className="flex-1 bg-linear-to-r from-emerald-500/15 via-teal-500/15 to-emerald-600/15 hover:from-emerald-500 hover:to-teal-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 hover:border-transparent py-2.5 px-3 rounded-xl font-extrabold transition-all text-xs flex items-center justify-center gap-1.5 shadow-md group/btn"
          >
            <span>View Recipe</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>

          <button
            onClick={handleCloneRecipe}
            disabled={cloning}
            className="px-3 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            title="Save Copy to My Recipe Collection"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={handleShareLink}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
              copied
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white"
            }`}
            title="Copy Public Share Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicRecipes;
