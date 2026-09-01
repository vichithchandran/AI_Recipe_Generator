import { useState, useEffect } from "react";
import { ChefHat, Sparkles, Plus, X, Clock, Users, Bookmark, CheckCircle, Wand2, FileText, ListPlus, Trash2, Coffee, UtensilsCrossed, Apple, Moon, ShoppingBag, Printer } from "lucide-react";
import Navbar from "../components/Navbar";

import toast from "react-hot-toast";
import { recipeService } from "../services/recipeService";
import { userService } from "../services/userService";
import { pantryService } from "../services/pantryService";

const CUISINES = [
  "Any",
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
const DIETARY_OPTIONS = [
  "Non-Vegetarian",
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

const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast", emoji: "🌅", icon: Coffee, color: "amber" },
  { id: "lunch",     label: "Lunch",     emoji: "☀️",  icon: UtensilsCrossed, color: "emerald" },
  { id: "snack",    label: "Snack",     emoji: "🍎",  icon: Apple, color: "orange" },
  { id: "dinner",   label: "Dinner",    emoji: "🌙",  icon: Moon,  color: "violet" },
];

const MEAL_TYPE_COLORS = {
  amber:   { active: "bg-amber-500/20 border-amber-400/60 text-amber-300",   icon: "text-amber-400" },
  emerald: { active: "bg-emerald-500/20 border-emerald-400/60 text-emerald-300", icon: "text-emerald-400" },
  orange:  { active: "bg-orange-500/20 border-orange-400/60 text-orange-300",  icon: "text-orange-400" },
  violet:  { active: "bg-violet-500/20 border-violet-400/60 text-violet-300",  icon: "text-violet-400" },
};

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputMode, setInputMode] = useState("quick"); // 'quick' | 'bulk'
  const [bulkText, setBulkText] = useState("");
  const [targetDish, setTargetDish] = useState("");
  const [fetchingIngredients, setFetchingIngredients] = useState(false);

  const [usePantry, setUsePantry] = useState(false);
  const [cuisineType, setCuisineType] = useState("Any");
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [mealType, setMealType] = useState(null); // null = not specified
  const [servings, setServings] = useState(4);
  const [cookingTime, setCookingTime] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
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
          // Pre-select first meal preference if user has saved any
          if (res.data.meal_preferences && res.data.meal_preferences.length > 0) {
            setMealType(res.data.meal_preferences[0]);
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadUserPreferences();
  }, []);

  const parseAndAddIngredients = (rawText) => {
    if (!rawText || !rawText.trim()) return;

    // Split by commas, semicolons, or newlines
    const items = rawText
      .split(/[,;\n]+/)
      .map((item) => item.replace(/^[\s•\-\d\.]+/g, "").trim())
      .filter((item) => item.length > 0);

    if (items.length === 0) return;

    const updated = [...ingredients];
    let addedCount = 0;

    items.forEach((item) => {
      if (!updated.includes(item)) {
        updated.push(item);
        addedCount++;
      }
    });

    setIngredients(updated);
    if (addedCount > 0) {
      toast.success(`Added ${addedCount} ingredient${addedCount > 1 ? "s" : ""}!`);
    }
  };

  const handleQuickAdd = () => {
    if (inputValue.trim()) {
      parseAndAddIngredients(inputValue);
      setInputValue("");
    }
  };

  const handleBulkAdd = () => {
    if (bulkText.trim()) {
      parseAndAddIngredients(bulkText);
      setBulkText("");
    }
  };

  const handleFetchDishIngredients = async () => {
    if (!targetDish || !targetDish.trim()) {
      toast.error("Please enter a dish name first!");
      return;
    }

    setFetchingIngredients(true);
    try {
      const res = await recipeService.fetchIngredientsForDish(
        targetDish.trim(),
        cuisineType,
        dietaryRestrictions
      );
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const newItems = [...ingredients];
        let addedCount = 0;
        res.data.forEach((item) => {
          if (!newItems.includes(item)) {
            newItems.push(item);
            addedCount++;
          }
        });
        setIngredients(newItems);
        toast.success(`AI fetched ${addedCount} ingredients for "${targetDish.trim()}"!`);
      } else {
        toast.error("Could not fetch ingredients for this dish name");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch ingredients");
    } finally {
      setFetchingIngredients(false);
    }
  };

  const clearAllIngredients = () => {
    setIngredients([]);
    toast.success("Ingredients list cleared");
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
    if (!usePantry && ingredients.length === 0 && (!targetDish || !targetDish.trim())) {
      toast.error("Please add ingredients, select pantry items, or mention a specific dish!");
      return;
    }

    setGenerating(true);
    setGeneratedRecipe(null);
    setIsSaved(false);
    setImageLoaded(false);
    setImageError(false);

    try {
      const res = await recipeService.generateRecipe({
        ingredients,
        usePantry,
        cuisineType,
        dietaryRestrictions,
        mealType: mealType || undefined,
        servings,
        cookingTime,
        targetDish: targetDish.trim(),
      });

      if (res.success && res.data) {
        setGeneratedRecipe(res.data);
        toast.success("AI Recipe generated successfully!");
        // Clear all inputs and reset preferences after successful generation
        setIngredients([]);
        setInputValue("");
        setBulkText("");
        setTargetDish("");
        setUsePantry(false);
        setCuisineType("Any");
        setDietaryRestrictions([]);
        setMealType(null);
        setServings(4);
        setCookingTime("medium");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate recipe");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe || isSaved) return;

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
        image_url: generatedRecipe.imageUrl || generatedRecipe.image_url || null,
        nutrition: generatedRecipe.nutrition || {},
        cooking_tips: generatedRecipe.cookingTips || generatedRecipe.cooking_tips || [],
      };

      const res = await recipeService.createRecipe(recipePayload);
      if (res.success) {
        setIsSaved(true);
        toast.success("Recipe saved to your collection!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <div className="no-print">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 no-print">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              AI Recipe <span className="text-gradient">Generator</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Mention a specific dish craving or input ingredients — our AI will automatically fetch ingredients and create a custom recipe.
            </p>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input & Parameters Column */}
          <div className="lg:col-span-5 space-y-6 no-print">

            {/* Ingredient Builder Card */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-emerald-400" />
                  <span>Ingredients</span>
                </h2>
                {ingredients.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllIngredients}
                    className="text-[11px] font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All ({ingredients.length})</span>
                  </button>
                )}
              </div>

              {/* Use Pantry Toggle */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 cursor-pointer mb-4 hover:bg-emerald-500/15 transition-colors">
                <input
                  type="checkbox"
                  checked={usePantry}
                  onChange={(e) => setUsePantry(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500 cursor-pointer shrink-0"
                />
                <span className="text-xs font-bold text-emerald-300">
                  Include active non-expired pantry items
                </span>
              </label>

              {/* Input Mode Selector Tabs */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setInputMode("quick")}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    inputMode === "quick"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Single / Comma List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("bulk")}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    inputMode === "bulk"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Bulk Textarea</span>
                </button>
              </div>

              {/* Single or Comma Separated Input */}
              {inputMode === "quick" ? (
                <div className="space-y-2 mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleQuickAdd())}
                      placeholder="Type single or multiple items (e.g. Tomatoes, Garlic, Onion)"
                      className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all text-xs flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    💡 Tip: Add individually or separate multiple items by commas (e.g. <span className="text-slate-400">Chicken, Garlic, Onion</span>)
                  </p>
                </div>
              ) : (
                /* Bulk Textarea Input Mode */
                <div className="space-y-3 mb-4">
                  <textarea
                    rows={4}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`Paste or type multiple ingredients list...\n\nExample:\n100g Basmati Rice\n200g Paneer\nGarlic, Ginger, Green Chillies`}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs leading-relaxed resize-y min-h-[80px] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleBulkAdd}
                    disabled={!bulkText.trim()}
                    className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    <ListPlus className="w-4 h-4" />
                    <span>Parse & Add All Ingredients</span>
                  </button>
                </div>
              )}

              {/* Ingredient Badges */}
              {ingredients.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                    <span>Active Recipe Ingredients:</span>
                    <span className="text-emerald-400 font-bold">{ingredients.length} items</span>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                    {ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs font-medium group hover:border-slate-700"
                      >
                        <span>{ingredient}</span>
                        <button
                          type="button"
                          onClick={() => removeIngredient(ingredient)}
                          className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-slate-800/80 rounded-2xl text-slate-500 text-xs">
                  No ingredients added yet. Mention a specific dish below or add ingredients above.
                </div>
              )}
            </div>

            {/* Custom Preferences Card */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-5">
              <h2 className="text-base font-bold text-white font-heading">Preferences</h2>

              {/* Meal Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Meal Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MEAL_TYPES.map((meal) => {
                    const isActive = mealType === meal.id;
                    const colors = MEAL_TYPE_COLORS[meal.color];
                    const Icon = meal.icon;
                    return (
                      <button
                        key={meal.id}
                        type="button"
                        onClick={() => setMealType(isActive ? null : meal.id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                          isActive
                            ? colors.active
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? colors.icon : "text-slate-600"}`} />
                        <span>{meal.emoji} {meal.label}</span>
                      </button>
                    );
                  })}
                </div>
                {mealType && (
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    ✨ AI will optimise the recipe for <span className="text-slate-300 font-semibold capitalize">{mealType}</span>
                  </p>
                )}
              </div>

              {/* Specific Target Dish Textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Specific Dish Craving (Optional)
                  </label>
                  {targetDish.trim() && (
                    <button
                      type="button"
                      onClick={handleFetchDishIngredients}
                      disabled={fetchingIngredients}
                      className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Auto-fetch ingredients for this dish using AI"
                    >
                      {fetchingIngredients ? (
                        <>
                          <div className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3 text-emerald-400" />
                          <span>Auto-Fetch Ingredients</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={targetDish}
                  onChange={(e) => setTargetDish(e.target.value)}
                  placeholder="Mention a specific dish (e.g. Kerala Karimeen Curry, Palak Paneer, Chicken Biryani)... AI will auto-fetch ingredients!"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs leading-relaxed resize-y min-h-[60px] transition-all"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  ✨ Enter any dish name above — AI will automatically determine and fetch the authentic ingredients!
                </p>
              </div>

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
                  {DIETARY_OPTIONS.map((option) => {
                    const isSelected = dietaryRestrictions.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleDietary(option)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Servings */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Target Servings</span>
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
              className="w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer"
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
                {/* Print-Only Branding Header */}
                <div className="print-only mb-6 pb-4 border-b border-slate-300">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xl font-bold text-slate-900 flex items-center gap-2 font-heading">
                        <ChefHat className="w-5 h-5 text-emerald-700" />
                        AI Recipe Generator
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Printed on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right text-xs font-semibold text-slate-700">
                      <div>Servings: <span className="font-bold text-slate-900">{generatedRecipe.servings}</span></div>
                    </div>
                  </div>
                </div>

                {/* Generated Recipe Image */}

                {(generatedRecipe.imageUrl || generatedRecipe.image_url) && (
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-slate-900">
                    {/* Skeleton loader shown while image is loading */}
                    {!imageLoaded && !imageError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 animate-pulse gap-2">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl">🍽️</div>
                        <p className="text-slate-500 text-xs font-medium">Loading dish image...</p>
                      </div>
                    )}
                    {/* Fallback shown if image fails to load */}
                    {imageError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 gap-2">
                        <span className="text-5xl">🍽️</span>
                        <p className="text-slate-400 text-xs font-semibold">{generatedRecipe.name}</p>
                      </div>
                    )}
                    <img
                      src={generatedRecipe.imageUrl || generatedRecipe.image_url}
                      alt={generatedRecipe.name}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => { setImageLoaded(true); setImageError(true); }}
                    />
                  </div>
                )}

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
                      <div key={index} className="flex items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0"></span>
                          <span className="text-slate-300 font-medium truncate">{ing.name}</span>
                        </div>
                        <span className="shrink-0 px-2 py-0.5 bg-emerald-500/15 text-emerald-300 font-bold rounded-lg border border-emerald-500/25 text-[11px]">
                          {parseFloat(ing.quantity)} {ing.unit}
                        </span>
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

                {/* Save, Print & Reset Actions */}
                <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-4 border-t border-slate-800/80 no-print">
                  <button
                    onClick={handleSaveRecipe}
                    disabled={saving || isSaved}
                    className={`flex-1 font-extrabold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2 ${
                      isSaved
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                        : "bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 cursor-pointer disabled:opacity-50"
                    }`}
                  >
                    {saving ? (
                      "Saving Recipe..."
                    ) : isSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Saved to Collection ✓</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        <span>Save Recipe to Collection</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
                    title="Print Recipe"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setGeneratedRecipe(null)}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    New Generation
                  </button>
                </div>

              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-16 text-center border border-slate-800/80 h-full flex flex-col items-center justify-center min-h-112.5">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-600">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Ready to Craft Your Recipe
                </h3>
                <p className="text-slate-400 text-xs mt-2 max-w-sm leading-relaxed">
                  Mention a specific dish craving under Preferences or add ingredients on the left to begin.
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
