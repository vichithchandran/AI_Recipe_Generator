import { useState, useEffect } from "react";
import { ChefHat, Sparkles, Plus, X, Clock, Users, Bookmark, CheckCircle, Wand2 } from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { recipeService } from "../services/recipeService";
import { userService } from "../services/userService";

const CUISINES = [
  "Any",
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
const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
];
const COOKING_TIMES = [
  { value: "quick", label: "Quick (<30m)" },
  { value: "medium", label: "Medium (30-60m)" },
  { value: "long", label: "Long (>60m)" },
];

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [usePantry, setUsePantry] = useState(false);
  const [cuisineType, setCuisineType] = useState("Any");
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [servings, setServings] = useState(4);
  const [cookingTime, setCookingTime] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const res = await userService.getPreferences();
      if (res.success && res.data) {
        if (res.data.dietary_restrictions && res.data.dietary_restrictions.length > 0) {
          setDietaryRestrictions(res.data.dietary_restrictions);
        }
        if (res.data.preferred_cuisines && res.data.preferred_cuisines.length > 0) {
          setCuisineType(res.data.preferred_cuisines[0]);
        }
        if (res.data.default_servings) {
          setServings(res.data.default_servings);
        }
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const toggleDietary = (option) => {
    if (dietaryRestrictions.includes(option)) {
      setDietaryRestrictions(dietaryRestrictions.filter((d) => d !== option));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, option]);
    }
  };

  const handleGenerate = async () => {
    if (!usePantry && ingredients.length === 0) {
      toast.error("Please add at least one ingredient or check use pantry items");
      return;
    }

    setGenerating(true);
    setGeneratedRecipe(null);

    try {
      const res = await recipeService.generateRecipe({
        ingredients,
        usePantry,
        cuisineType,
        dietaryRestrictions,
        servings,
        cookingTime,
      });

      if (res.success && res.data) {
        setGeneratedRecipe(res.data);
        toast.success("AI Recipe generated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate recipe");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;

    setSaving(true);
    try {
      const recipePayload = {
        name: generatedRecipe.name,
        description: generatedRecipe.description || "",
        cuisine_type: generatedRecipe.cuisineType || generatedRecipe.cuisine_type || "Other",
        difficulty: generatedRecipe.difficulty || "medium",
        prep_time: generatedRecipe.prepTime || generatedRecipe.prep_time || 0,
        cook_time: generatedRecipe.cookTime || generatedRecipe.cook_time || 0,
        servings: generatedRecipe.servings || 4,
        ingredients: generatedRecipe.ingredients || [],
        instructions: generatedRecipe.instructions || [],
        dietary_tags: generatedRecipe.dietaryTags || generatedRecipe.dietary_tags || [],
        nutrition: generatedRecipe.nutrition || {},
        cooking_tips: generatedRecipe.cookingTips || generatedRecipe.cooking_tips || [],
      };

      const res = await recipeService.createRecipe(recipePayload);
      if (res.success) {
        toast.success("Recipe saved to your collection!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-xl shadow-emerald-500/20">
            <Wand2 className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-heading">
            AI Recipe <span className="text-gradient">Generator</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Input available ingredients or pull from your pantry — our AI will create a safe, delicious, custom recipe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input & Parameters Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ingredient Builder Card */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
              <h2 className="text-base font-bold text-white mb-4 font-heading flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-400" />
                <span>Ingredients</span>
              </h2>

              {/* Use Pantry Toggle */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 cursor-pointer mb-4 hover:bg-emerald-500/15 transition-colors">
                <input
                  type="checkbox"
                  checked={usePantry}
                  onChange={(e) => setUsePantry(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-emerald-300">
                  Include active non-expired pantry items
                </span>
              </label>

              {/* Add Ingredient Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                  placeholder="Type ingredient (e.g. Tomatoes)"
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-xs"
                />
                <button
                  onClick={addIngredient}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all text-xs flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Ingredient Badges */}
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs font-medium"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Preferences Card */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-5">
              <h2 className="text-base font-bold text-white font-heading">Preferences</h2>

              {/* Cuisine Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Cuisine Style
                </label>
                <select
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none text-xs"
                >
                  {CUISINES.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Dietary Restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleDietary(option)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        dietaryRestrictions.includes(option)
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Servings */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>Servings</span>
                  <span className="text-emerald-400 font-bold">{servings} people</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Cooking Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Cook Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COOKING_TIMES.map((time) => (
                    <button
                      key={time.value}
                      type="button"
                      onClick={() => setCookingTime(time.value)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        cookingTime === time.value
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Chef AI is Cooking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Recipe</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Recipe Output Column */}
          <div className="lg:col-span-7">
            {generatedRecipe ? (
              <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 shadow-2xl space-y-6 animate-fade-in">
                {/* Title & Header */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold">
                      {generatedRecipe.cuisineType || generatedRecipe.cuisine_type}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold capitalize">
                      {generatedRecipe.difficulty}
                    </span>
                    {(generatedRecipe.dietaryTags || generatedRecipe.dietary_tags)?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-full text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading">
                    {generatedRecipe.name}
                  </h2>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    {generatedRecipe.description}
                  </p>

                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800/80 text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>
                        {(generatedRecipe.prepTime || generatedRecipe.prep_time || 0) +
                          (generatedRecipe.cookTime || generatedRecipe.cook_time || 0)}{" "}
                        mins total
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>{generatedRecipe.servings} servings</span>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80">
                  <h3 className="font-bold text-white text-sm mb-3 font-heading flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Required Ingredients</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {generatedRecipe.ingredients?.map((ing, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        <span className="font-bold text-white">{ing.quantity} {ing.unit}</span>
                        <span className="text-slate-400">{ing.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="font-bold text-white text-sm mb-3 font-heading">Cooking Instructions</h3>
                  <ol className="space-y-3">
                    {generatedRecipe.instructions?.map((step, index) => (
                      <li key={index} className="flex gap-3 text-xs text-slate-300">
                        <span className="shrink-0 w-6 h-6 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Save & Reset Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={handleSaveRecipe}
                    disabled={saving}
                    className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold py-3 rounded-xl transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                  >
                    <Bookmark className="w-4 h-4" />
                    {saving ? "Saving Recipe..." : "Save Recipe to Collection"}
                  </button>
                  <button
                    onClick={() => setGeneratedRecipe(null)}
                    className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                  >
                    New Generation
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-16 text-center border border-slate-800/80 h-full flex flex-col items-center justify-center min-h-[450px]">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-600">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-300 font-heading">Your Custom Recipe Will Appear Here</h3>
                <p className="text-slate-500 text-xs mt-2 max-w-sm">
                  Add your ingredients on the left and click "Generate AI Recipe" to create a bespoke culinary guide.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
