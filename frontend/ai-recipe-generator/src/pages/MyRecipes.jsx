import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, ChefHat, Trash2, Sparkles, ArrowRight, Plus, X, Video, Image, Wand2, Calculator, PlusCircle, Layers, Utensils, Share2, Globe, Lock, Check, Users, Flame } from "lucide-react";

import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
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

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Confirm Modal state
  const [deleteRecipeId, setDeleteRecipeId] = useState(null);

  const fetchRecipes = useCallback(async () => {
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
  }, [searchQuery, selectedCuisine, selectedDifficulty]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

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
            <p className="text-slate-400 text-sm mt-1">Browse, create, and manage your saved and custom recipes</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/community"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold px-5 py-3 rounded-xl transition-all text-xs"
            >
              <Globe className="w-4 h-4" />
              <span>Explore Community Landing Page</span>
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Recipe</span>
            </button>

            <Link
              to="/generate"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-bold px-5 py-3 rounded-xl hover:bg-slate-800 transition-all text-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Recipe Generator</span>
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
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Your Custom Recipe
              </button>
            </div>
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

      {/* Create Custom Recipe Modal */}
      {showCreateModal && (
        <CreateRecipeModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchRecipes();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

const RecipeCard = ({ recipe, onDelete }) => {
  const [isPublic, setIsPublic] = useState(recipe.is_public !== false);
  const [copied, setCopied] = useState(false);

  const totalTime = (recipe.prep_time || recipe.prepTime || 0) + (recipe.cook_time || recipe.cookTime || 0);
  const isCombo = recipe.is_combo || (recipe.items && recipe.items.length > 0);
  const calories = recipe.nutrition?.calories || recipe.calories || 350;
  const servings = recipe.servings || 4;

  const handleTogglePublic = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await recipeService.togglePublicStatus(recipe.id || recipe._id);
      if (res.success) {
        const updated = res.data?.is_public !== false;
        setIsPublic(updated);
        toast.success(updated ? "Recipe is now Public 🌐" : "Recipe is now Private 🔒");
      }
    } catch (error) {
      toast.error("Failed to update public status");
    }
  };

  const handleShareLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/recipes/${recipe.id || recipe._id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Public share link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    medium: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    hard: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  };

  return (
    <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 glass-panel-hover flex flex-col justify-between group shadow-xl hover:shadow-emerald-500/10">
      <div>
        {/* Banner Image Container */}
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

          {/* Top Right Tags & Public Status */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {recipe.cuisine_type && (
              <span className="px-2.5 py-1 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-emerald-400 rounded-lg text-[11px] font-extrabold shadow-md">
                {recipe.cuisine_type}
              </span>
            )}
            <button
              onClick={handleTogglePublic}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border flex items-center gap-1 transition-all cursor-pointer shadow-md ${
                isPublic
                  ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/90"
                  : "bg-slate-900/90 border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
              title={isPublic ? "Public Recipe (Click to make Private)" : "Private Recipe (Click to make Public)"}
            >
              {isPublic ? (
                <>
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Private</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card Content Body */}
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

      {/* Card Actions Footer */}
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

          <button
            onClick={() => onDelete(recipe.id || recipe._id)}
            className="px-3 py-2.5 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"
            title="Delete Recipe"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


const DIETARY_OPTIONS = [
  "Non-Vegetarian",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
];

const CreateRecipeModal = ({ onClose, onSuccess }) => {
  const [isCombo, setIsCombo] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisine_type: "Indian",
    difficulty: "medium",
    prep_time: 15,
    cook_time: 25,
    servings: 4,
    image_url: "",
    video_url: "",
  });

  const [dietaryTags, setDietaryTags] = useState(["Vegetarian"]);
  
  // Single Dish State
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: 1, unit: "g" },
  ]);
  const [instructions, setInstructions] = useState([""]);

  // Combo Meal State
  const [comboItems, setComboItems] = useState([
    {
      name: "Main Dish (e.g. Paneer Butter Masala)",
      ingredients: [{ name: "", quantity: 1, unit: "g" }],
      instructions: [""]
    },
    {
      name: "Side Dish (e.g. Garlic Naan)",
      ingredients: [{ name: "", quantity: 1, unit: "g" }],
      instructions: [""]
    }
  ]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [fetchingItemIng, setFetchingItemIng] = useState(false);

  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  });

  const [submitting, setSubmitting] = useState(false);
  const [calculatingNutrition, setCalculatingNutrition] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const toggleDietaryTag = (tag) => {
    if (dietaryTags.includes(tag)) {
      setDietaryTags(dietaryTags.filter((t) => t !== tag));
    } else {
      if (tag === "Non-Vegetarian") {
        setDietaryTags([...dietaryTags.filter((t) => t !== "Vegetarian" && t !== "Vegan"), tag]);
      } else if (tag === "Vegetarian" || tag === "Vegan") {
        setDietaryTags([...dietaryTags.filter((t) => t !== "Non-Vegetarian"), tag]);
      } else {
        setDietaryTags([...dietaryTags, tag]);
      }
    }
  };

  // --- Single Dish Ingredient Helpers ---
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 1, unit: "g" }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // --- Single Dish Instruction Helpers ---
  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  // --- Combo Item Helpers ---
  const handleAddComboItem = () => {
    const newItem = {
      name: `Dish Item ${comboItems.length + 1}`,
      ingredients: [{ name: "", quantity: 1, unit: "g" }],
      instructions: [""]
    };
    setComboItems([...comboItems, newItem]);
    setActiveItemIndex(comboItems.length);
  };

  const handleRemoveComboItem = (index) => {
    if (comboItems.length <= 1) {
      toast.error("A combo meal must have at least 1 item!");
      return;
    }
    const updated = comboItems.filter((_, i) => i !== index);
    setComboItems(updated);
    if (activeItemIndex >= updated.length) {
      setActiveItemIndex(updated.length - 1);
    }
  };

  const handleComboItemNameChange = (index, name) => {
    const updated = [...comboItems];
    updated[index].name = name;
    setComboItems(updated);
  };

  const handleComboIngredientAdd = (itemIdx) => {
    const updated = [...comboItems];
    updated[itemIdx].ingredients.push({ name: "", quantity: 1, unit: "g" });
    setComboItems(updated);
  };

  const handleComboIngredientRemove = (itemIdx, ingIdx) => {
    const updated = [...comboItems];
    if (updated[itemIdx].ingredients.length === 1) return;
    updated[itemIdx].ingredients = updated[itemIdx].ingredients.filter((_, i) => i !== ingIdx);
    setComboItems(updated);
  };

  const handleComboIngredientChange = (itemIdx, ingIdx, field, val) => {
    const updated = [...comboItems];
    updated[itemIdx].ingredients[ingIdx][field] = val;
    setComboItems(updated);
  };

  const handleComboInstructionAdd = (itemIdx) => {
    const updated = [...comboItems];
    updated[itemIdx].instructions.push("");
    setComboItems(updated);
  };

  const handleComboInstructionRemove = (itemIdx, stepIdx) => {
    const updated = [...comboItems];
    if (updated[itemIdx].instructions.length === 1) return;
    updated[itemIdx].instructions = updated[itemIdx].instructions.filter((_, i) => i !== stepIdx);
    setComboItems(updated);
  };

  const handleComboInstructionChange = (itemIdx, stepIdx, val) => {
    const updated = [...comboItems];
    updated[itemIdx].instructions[stepIdx] = val;
    setComboItems(updated);
  };

  const [fetchingSingleIng, setFetchingSingleIng] = useState(false);

  // AI Auto-Fetch Ingredients for Single Dish Mode
  const handleFetchIngredientsForSingleDish = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a recipe name first!");
      return;
    }
    setFetchingSingleIng(true);
    try {
      const res = await recipeService.fetchIngredientsForDish(formData.name, formData.cuisine_type, dietaryTags);
      if (res.success && res.data && res.data.length > 0) {
        const fetchedIngs = res.data.map((ing) => {
          if (typeof ing === "string") {
            return { name: ing, quantity: 1, unit: "g" };
          } else if (typeof ing === "object" && ing.name) {
            return { name: ing.name, quantity: ing.quantity || 1, unit: ing.unit || "g" };
          }
          return { name: String(ing), quantity: 1, unit: "g" };
        });
        setIngredients(fetchedIngs);
        toast.success(`AI auto-fetched ${fetchedIngs.length} ingredients for "${formData.name}"!`);
      } else {
        toast.error("No ingredients found for this dish name");
      }
    } catch (e) {
      toast.error("Failed to auto-fetch ingredients with AI");
    } finally {
      setFetchingSingleIng(false);
    }
  };

  // AI Auto-Fetch Ingredients for Combo Item
  const handleFetchIngredientsForComboItem = async (itemIdx) => {
    const itemName = comboItems[itemIdx]?.name;
    if (!itemName || !itemName.trim()) {
      toast.error("Please enter a dish name for this item first!");
      return;
    }
    setFetchingItemIng(true);
    try {
      const res = await recipeService.fetchIngredientsForDish(itemName, formData.cuisine_type, dietaryTags);
      if (res.success && res.data && res.data.length > 0) {
        const updated = [...comboItems];
        updated[itemIdx].ingredients = res.data.map((ing) => {
          if (typeof ing === "string") {
            return { name: ing, quantity: 1, unit: "g" };
          } else if (typeof ing === "object" && ing.name) {
            return { name: ing.name, quantity: ing.quantity || 1, unit: ing.unit || "g" };
          }
          return { name: String(ing), quantity: 1, unit: "g" };
        });
        setComboItems(updated);
        toast.success(`Fetched ingredients for "${itemName}"!`);
      } else {
        toast.error(`No ingredients found for "${itemName}"`);
      }
    } catch (e) {
      toast.error("Failed to fetch ingredients with AI");
    } finally {
      setFetchingItemIng(false);
    }
  };

  // AI Auto-Generate Image
  const handleGenerateImage = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a recipe name first!");
      return;
    }
    setGeneratingImage(true);
    const dishPrompt = [
      formData.name,
      formData.cuisine_type,
      isCombo ? "combo meal thali feast" : "plated dish",
      "gourmet food photography",
      "restaurant style",
    ].join(", ");

    const promptText = encodeURIComponent(dishPrompt);
    const seed = Math.floor(Math.random() * 999999);
    const generatedUrl = `https://image.pollinations.ai/prompt/${promptText}?width=900&height=600&nologo=true&enhance=true&seed=${seed}`;

    setFormData((prev) => ({ ...prev, image_url: generatedUrl }));
    setGeneratingImage(false);
    toast.success("Generated dish image with AI!");
  };

  // AI Calculate Nutrition per Serving
  const handleCalculateNutrition = async () => {
    let allValidIngredients = [];
    if (isCombo) {
      comboItems.forEach((item) => {
        item.ingredients.forEach((ing) => {
          if (ing.name && ing.name.trim()) {
            allValidIngredients.push(ing);
          }
        });
      });
    } else {
      allValidIngredients = ingredients.filter((i) => i.name && i.name.trim());
    }

    if (allValidIngredients.length === 0) {
      toast.error("Please add at least one ingredient to calculate nutrition!");
      return;
    }

    setCalculatingNutrition(true);
    try {
      const res = await recipeService.calculateNutrition(
        formData.name || (isCombo ? "Combo Meal" : "Custom Dish"),
        allValidIngredients,
        formData.servings || 4
      );

      if (res.success && res.data) {
        setNutrition(res.data);
        toast.success("AI calculated nutritional facts per serving!");
      }
    } catch (error) {
      toast.error("Failed to calculate nutrition with AI");
    } finally {
      setCalculatingNutrition(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter recipe name");
      return;
    }

    let recipePayload = {};

    if (isCombo) {
      const formattedItems = [];
      const aggregatedIngredients = [];
      const aggregatedInstructions = [];

      for (let i = 0; i < comboItems.length; i++) {
        const item = comboItems[i];
        const itemName = item.name.trim() || `Item ${i + 1}`;
        const validIngs = item.ingredients.filter((ing) => ing.name && ing.name.trim());
        const validSteps = item.instructions.filter((step) => step && step.trim());

        if (validIngs.length === 0) {
          toast.error(`Please add at least one ingredient for "${itemName}"`);
          return;
        }
        if (validSteps.length === 0) {
          toast.error(`Please add at least one instruction step for "${itemName}"`);
          return;
        }

        const formattedIngs = validIngs.map((ing) => ({
          name: ing.name.trim(),
          quantity: parseFloat(ing.quantity) || 1,
          unit: ing.unit || "g",
        }));

        formattedItems.push({
          name: itemName,
          ingredients: formattedIngs,
          instructions: validSteps,
        });

        aggregatedIngredients.push(...formattedIngs);
        validSteps.forEach((step) => {
          aggregatedInstructions.push(`[${itemName}] ${step}`);
        });
      }

      recipePayload = {
        name: formData.name.trim(),
        description: formData.description,
        cuisine_type: formData.cuisine_type,
        difficulty: formData.difficulty,
        prep_time: parseInt(formData.prep_time) || 0,
        cook_time: parseInt(formData.cook_time) || 0,
        servings: parseInt(formData.servings) || 4,
        image_url: formData.image_url.trim() || null,
        video_url: formData.video_url.trim() || null,
        is_combo: true,
        items: formattedItems,
        ingredients: aggregatedIngredients,
        instructions: aggregatedInstructions,
        dietary_tags: dietaryTags,
        nutrition: nutrition,
        calories: nutrition.calories || 0,
      };
    } else {
      const validIngredients = ingredients.filter((i) => i.name && i.name.trim());
      if (validIngredients.length === 0) {
        toast.error("Please add at least one ingredient");
        return;
      }

      const validInstructions = instructions.filter((i) => i && i.trim());
      if (validInstructions.length === 0) {
        toast.error("Please add at least one cooking instruction step");
        return;
      }

      recipePayload = {
        name: formData.name.trim(),
        description: formData.description,
        cuisine_type: formData.cuisine_type,
        difficulty: formData.difficulty,
        prep_time: parseInt(formData.prep_time) || 0,
        cook_time: parseInt(formData.cook_time) || 0,
        servings: parseInt(formData.servings) || 4,
        image_url: formData.image_url.trim() || null,
        video_url: formData.video_url.trim() || null,
        is_combo: false,
        items: [],
        ingredients: validIngredients.map((ing) => ({
          name: ing.name.trim(),
          quantity: parseFloat(ing.quantity) || 1,
          unit: ing.unit || "g",
        })),
        instructions: validInstructions,
        dietary_tags: dietaryTags,
        nutrition: nutrition,
        calories: nutrition.calories || 0,
      };
    }

    setSubmitting(true);

    try {
      const res = await recipeService.createRecipe(recipePayload);
      if (res.success) {
        toast.success(isCombo ? "Custom combo meal recipe saved!" : "Custom recipe saved to your collection!");
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save custom recipe");
    } finally {
      setSubmitting(false);
    }
  };

  const activeComboItem = comboItems[activeItemIndex] || comboItems[0];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass-panel rounded-3xl max-w-3xl w-full p-6 border border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Add Custom Recipe</h2>
            <p className="text-xs text-slate-400">Create single dish recipes or multi-item combo meals with individual ingredients & instructions</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto p-1.5 pr-2 flex-1 custom-scrollbar">
          {/* Mode Selector: Single Dish vs Combo Meal */}
          <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setIsCombo(false)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !isCombo
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Single Dish Recipe</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCombo(true)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isCombo
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Combo Meal (Multi-Item)</span>
            </button>
          </div>

          {/* Recipe Name & Cuisine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                {isCombo ? "Combo Meal Title *" : "Recipe Name *"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isCombo ? "e.g. Deluxe North Indian Thali Combo" : "e.g. Grandma's Butter Chicken"}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Cuisine Style</label>
              <select
                value={formData.cuisine_type}
                onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs transition-all"
              >
                {CUISINES
                  .filter((c) => c !== "All")
                  .map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isCombo ? "Describe this combo meal (e.g. Includes Butter Chicken, Garlic Naan & Jeera Rice)" : "Brief description or backstory of dish..."}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs leading-relaxed resize-y min-h-[60px] transition-all"
            />
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              Dietary Tags (Veg / Non-Veg / Vegan / etc.)
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => {
                const isSelected = dietaryTags.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDietaryTag(option)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? option === "Non-Vegetarian"
                          ? "bg-red-500/20 text-red-300 border border-red-500/40"
                          : option === "Vegetarian" || option === "Vegan"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {option === "Non-Vegetarian" && "🔴 "}
                    {(option === "Vegetarian" || option === "Vegan") && "🟢 "}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prep Time, Cook Time, Servings, Difficulty */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Prep Time (m)</label>
              <input
                type="number"
                value={formData.prep_time}
                onChange={(e) => setFormData({ ...formData, prep_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Cook Time (m)</label>
              <input
                type="number"
                value={formData.cook_time}
                onChange={(e) => setFormData({ ...formData, cook_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Servings</label>
              <input
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none capitalize"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC SECTION: Single Dish VS Combo Meal */}
          {!isCombo ? (
            /* SINGLE DISH MODE */
            <>
              {/* Ingredients */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-emerald-400" />
                    <span>Ingredients Used *</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleFetchIngredientsForSingleDish}
                      disabled={fetchingSingleIng}
                      className="text-xs font-bold text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Auto-fetch ingredients with AI based on recipe name"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{fetchingSingleIng ? "Fetching..." : "AI Fetch Ingredients"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Ingredient</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {ingredients.map((ing, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                        placeholder="Ingredient Name (e.g. Chicken)"
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none focus:border-emerald-500"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={ing.quantity}
                        onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                        className="w-20 px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none text-center"
                        placeholder="Qty"
                      />
                      <select
                        value={ing.unit}
                        onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                        className="w-24 px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none"
                      >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="pieces">pcs</option>
                        <option value="cups">cups</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-emerald-400" />
                    <span>Step-by-Step Instructions *</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {instructions.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mt-1">
                        {index + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={step}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        placeholder={`Step ${index + 1} instructions...`}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none focus:border-emerald-500 resize-y min-h-[50px]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(index)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0 mt-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* COMBO MEAL MULTI-ITEM MODE */
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Combo Dish Items ({comboItems.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddComboItem}
                  className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Add Dish Item</span>
                </button>
              </div>

              {/* Item Tabs Bar */}
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {comboItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveItemIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        activeItemIndex === idx
                          ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                          : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.name || `Item ${idx + 1}`}</span>
                    </button>
                    {comboItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveComboItem(idx)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove combo item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Active Combo Item Detail Form */}
              {activeComboItem && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  {/* Dish Item Name & Auto-Fetch Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Dish Item Title *
                      </label>
                      <input
                        type="text"
                        value={activeComboItem.name}
                        onChange={(e) => handleComboItemNameChange(activeItemIndex, e.target.value)}
                        placeholder="e.g. Paneer Butter Masala, Garlic Naan, or Jeera Rice"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFetchIngredientsForComboItem(activeItemIndex)}
                      disabled={fetchingItemIng}
                      className="px-3 py-2 bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 text-purple-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                      title="AI Auto-Fetch ingredients for this dish item"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{fetchingItemIng ? "Fetching..." : "AI Fetch Item Ingredients"}</span>
                    </button>
                  </div>

                  {/* Active Item Ingredients */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-300 uppercase">
                        Ingredients for "{activeComboItem.name || 'Item'}" *
                      </label>
                      <button
                        type="button"
                        onClick={() => handleComboIngredientAdd(activeItemIndex)}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Ingredient</span>
                      </button>
                    </div>

                    {activeComboItem.ingredients.map((ing, ingIdx) => (
                      <div key={ingIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ing.name}
                          onChange={(e) => handleComboIngredientChange(activeItemIndex, ingIdx, "name", e.target.value)}
                          placeholder="Ingredient Name (e.g. Paneer)"
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none focus:border-emerald-500"
                          required
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={ing.quantity}
                          onChange={(e) => handleComboIngredientChange(activeItemIndex, ingIdx, "quantity", e.target.value)}
                          className="w-20 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none text-center"
                          placeholder="Qty"
                        />
                        <select
                          value={ing.unit}
                          onChange={(e) => handleComboIngredientChange(activeItemIndex, ingIdx, "unit", e.target.value)}
                          className="w-20 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none"
                        >
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="ml">ml</option>
                          <option value="l">l</option>
                          <option value="pieces">pcs</option>
                          <option value="cups">cups</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleComboIngredientRemove(activeItemIndex, ingIdx)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Active Item Instructions */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-300 uppercase">
                        Instructions for "{activeComboItem.name || 'Item'}" *
                      </label>
                      <button
                        type="button"
                        onClick={() => handleComboInstructionAdd(activeItemIndex)}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Step</span>
                      </button>
                    </div>

                    {activeComboItem.instructions.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-start gap-2">
                        <span className="shrink-0 w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center mt-1">
                          {stepIdx + 1}
                        </span>
                        <textarea
                          rows={2}
                          value={step}
                          onChange={(e) => handleComboInstructionChange(activeItemIndex, stepIdx, e.target.value)}
                          placeholder={`Cooking step ${stepIdx + 1} for ${activeComboItem.name}...`}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none focus:border-emerald-500 resize-y min-h-[50px]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleComboInstructionRemove(activeItemIndex, stepIdx)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0 mt-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image & Video Reference URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image of Dish / Combo */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-teal-400" />
                  <span>Dish Image URL</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={generatingImage}
                  className="text-[10px] font-bold text-teal-300 hover:text-teal-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Generate food photo with AI"
                >
                  <Wand2 className="w-3 h-3 text-teal-400" />
                  <span>AI Generate Image</span>
                </button>
              </div>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 outline-none text-xs"
              />
              {formData.image_url && (
                <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-800 mt-2">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Video Reference URL */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-400" />
                <span>Video Reference URL</span>
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or Video Link"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 outline-none text-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                📹 Attach a YouTube tutorial or video link for cooking guidance
              </p>
            </div>
          </div>

          {/* AI Nutrition per Serving Calculator */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <label className="text-xs font-bold text-white uppercase">Nutrition per Serving</label>
              </div>
              <button
                type="button"
                onClick={handleCalculateNutrition}
                disabled={calculatingNutrition}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs hover:bg-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {calculatingNutrition ? (
                  <>
                    <div className="w-3.5 h-3.5 border border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Calculate Nutrition with AI</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-1">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase text-center mb-1">Calories</label>
                <input
                  type="number"
                  value={nutrition.calories}
                  onChange={(e) => setNutrition({ ...nutrition, calories: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase text-center mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={nutrition.protein}
                  onChange={(e) => setNutrition({ ...nutrition, protein: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none text-center font-bold text-emerald-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase text-center mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={nutrition.carbs}
                  onChange={(e) => setNutrition({ ...nutrition, carbs: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none text-center font-bold text-blue-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase text-center mb-1">Fats (g)</label>
                <input
                  type="number"
                  value={nutrition.fats}
                  onChange={(e) => setNutrition({ ...nutrition, fats: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none text-center font-bold text-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase text-center mb-1">Fiber (g)</label>
                <input
                  type="number"
                  value={nutrition.fiber}
                  onChange={(e) => setNutrition({ ...nutrition, fiber: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs outline-none text-center font-bold text-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              className="flex-1 px-4 py-2.5 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-900 font-semibold text-xs transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-extrabold text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving Recipe..." : isCombo ? "Save Combo Meal Recipe" : "Save Custom Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyRecipes;
