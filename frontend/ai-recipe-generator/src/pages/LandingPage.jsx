import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ChefHat,
  Globe,
  UtensilsCrossed,
  Calendar,
  ShoppingCart,
  Calculator,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Share2,
  Clock,
  Users,
  Flame,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import DietSymbol from "../components/DietSymbol";
import { recipeService } from "../services/recipeService";

const LandingPage = () => {
  const [publicRecipes, setPublicRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await recipeService.getPublicRecipes("", "All", "All", 6);
        if (res.success && res.data) {
          setPublicRecipes(res.data.map((r) => ({ ...r, id: r._id })));
        }
      } catch (error) {
        console.error("Failed to load featured recipes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Recipe Generation & Community Sharing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-heading leading-tight sm:leading-tight">
            Unleash Your Inner Chef with{" "}
            <span className="text-gradient">AI Cooking Intelligence</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            Turn pantry ingredients into chef-grade recipes, plan your weekly meals, calculate nutrition, and share your signature dishes with a vibrant culinary community!
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/community"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all text-sm"
            >
              <Globe className="w-5 h-5" />
              <span>Explore Community Recipes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/generate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all text-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Try AI Generator</span>
            </Link>
          </div>
        </div>
      </section>


      {/* Featured Community Public Recipes Section */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Live Public Showcase</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">
                Explore <span className="text-gradient">Public Community Recipes</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Delicious dishes shared publicly by community members. Browse, cook, and get inspired!
              </p>
            </div>

            <Link
              to="/community"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>View All Community Recipes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured Recipes Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading public recipes...</div>
          ) : publicRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicRecipes.map((recipe) => (
                <LandingRecipeCard key={recipe.id || recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              No public recipes available yet. Be the first to share one!
            </div>
          )}
        </div>
      </section>

      {/* Core Features Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Everything You Need for <span className="text-gradient">Smarter Cooking</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From smart pantry tracking to instant AI recipe creation and public sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-emerald-400" />}
            title="AI Recipe Generator"
            description="Generate customized recipes instantly based on dish name, available pantry ingredients, or dietary preferences."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-teal-400" />}
            title="Public Recipe Sharing"
            description="Share your signature dishes publicly, copy shareable links for friends, or clone community recipes to your collection."
          />
          <FeatureCard
            icon={<UtensilsCrossed className="w-6 h-6 text-blue-400" />}
            title="Pantry Ingredient Manager"
            description="Track what's inside your kitchen fridge and pantry to cook recipes that minimize ingredient waste."
          />
          <FeatureCard
            icon={<Calendar className="w-6 h-6 text-purple-400" />}
            title="Weekly Meal Planner"
            description="Schedule breakfast, lunch, and dinner for the week ahead with single-click recipe assignment."
          />
          <FeatureCard
            icon={<ShoppingCart className="w-6 h-6 text-amber-400" />}
            title="Automated Grocery List"
            description="Generate organized shopping checklists from your planned recipes and pantry stock instantly."
          />
          <FeatureCard
            icon={<Calculator className="w-6 h-6 text-red-400" />}
            title="Nutrition Calculator"
            description="View real-time estimates of calories, protein, carbohydrates, and fats for any customized dish."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-900/50 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5" />
              <span>Simple 3-Step Process</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              How <span className="text-gradient">AI Recipe Hub</span> Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step="01"
              title="Select Ingredients or Dish"
              description="Type a dish name or pick ingredients available in your pantry."
            />
            <StepCard
              step="02"
              title="AI Magic Creates Recipe"
              description="Our AI instantly crafts detailed ingredients, step-by-step instructions, and nutrition info."
            />
            <StepCard
              step="03"
              title="Share & Enjoy"
              description="Toggle public visibility to showcase your recipe on the public community landing page!"
            />
          </div>
        </div>
      </section>

      {/* Platform Impact & Stats Section */}
      <section className="py-14 bg-slate-900/30 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 text-center hover:border-emerald-500/30 transition-all shadow-xl">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-heading mb-1">1,000+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Recipes Generated</div>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 text-center hover:border-teal-500/30 transition-all shadow-xl">
              <div className="text-3xl sm:text-4xl font-black text-teal-400 font-heading mb-1">30+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Indian & Global Cuisines</div>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 text-center hover:border-blue-500/30 transition-all shadow-xl">
              <div className="text-3xl sm:text-4xl font-black text-blue-400 font-heading mb-1">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Public Sharing</div>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 text-center hover:border-purple-500/30 transition-all shadow-xl">
              <div className="text-3xl sm:text-4xl font-black text-purple-400 font-heading mb-1">Free</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">For Foodies & Home Chefs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center border border-emerald-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-teal-500/10 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading">
              Ready to Share & Discover <span className="text-gradient">Amazing Recipes?</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Join food lovers using AI Recipe Hub to cook smarter every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all text-sm"
              >
                <UserCheck className="w-5 h-5" />
                <span>Create Free Account</span>
              </Link>
              <Link
                to="/community"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 text-slate-200 hover:text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all text-sm"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Browse Public Recipes</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-white">AI Recipe Hub</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex gap-4 font-semibold text-slate-400">
            <Link to="/community" className="hover:text-emerald-400 transition-colors">
              Community
            </Link>
            <Link to="/login" className="hover:text-emerald-400 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-emerald-400 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 hover:border-emerald-500/40 transition-all group glass-panel-hover shadow-lg">
    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-extrabold text-white font-heading mb-2 group-hover:text-emerald-400 transition-colors">
      {title}
    </h3>
    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ step, title, description }) => (
  <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 text-left relative overflow-hidden">
    <div className="text-4xl font-black text-emerald-500/20 font-heading mb-3">{step}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const LandingRecipeCard = ({ recipe }) => {
  const totalTime = (recipe.prep_time || recipe.prepTime || 0) + (recipe.cook_time || recipe.cookTime || 0);
  const calories = recipe.nutrition?.calories || recipe.calories || 350;
  const servings = recipe.servings || 4;
  const authorName = recipe.user?.name || "Community Chef";

  return (
    <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden hover:border-emerald-500/40 transition-all glass-panel-hover flex flex-col justify-between group shadow-xl">
      <div>
        <div className="h-44 bg-linear-to-br from-slate-900 to-slate-950 border-b border-slate-800/80 flex items-center justify-center relative overflow-hidden">
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
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-emerald-400" />
            </div>
          )}

          <div className="absolute top-3 right-3">
            {recipe.cuisine_type && (
              <span className="px-2.5 py-1 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-emerald-400 rounded-lg text-[10px] font-extrabold">
                {recipe.cuisine_type}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 space-y-2">
          <div className="flex items-center gap-2">
            <DietSymbol
              name={recipe.name}
              tags={recipe.dietary_tags || []}
              ingredients={recipe.ingredients || []}
              className="w-4 h-4 shrink-0"
            />
            <h3 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-1 font-heading">
              {recipe.name}
            </h3>
          </div>

          {recipe.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{recipe.description}</p>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shared by <strong className="text-slate-200">{authorName}</strong></span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 mt-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{totalTime} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{calories} kcal</span>
          </div>
        </div>

        <Link
          to={`/recipes/${recipe.id || recipe._id}`}
          className="w-full bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 border border-slate-800 hover:border-transparent py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-emerald-300"
        >
          <span>View Recipe</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
