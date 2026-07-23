import { Calendar, ChefHat, Clock, UtensilsCrossed, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { dashboardService } from "../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    pantryItems: 0,
    mealsThisWeek: 0,
    expiringSoonCount: 0,
  });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [upcomingMeals, setUpcomingMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getStats();
        if (res.success) {
          setStats({
            totalRecipes: res.stats.totalRecipes || 0,
            pantryItems: res.stats.pantryItems || 0,
            mealsThisWeek: res.stats.mealsThisWeek || 0,
            expiringSoonCount: res.stats.expiringSoonCount || 0,
          });

          if (res.recentRecipes) {
            setRecentRecipes(res.recentRecipes.map((r) => ({ ...r, id: r._id })));
          }

          if (res.upcomingMeals) {
            setUpcomingMeals(
              res.upcomingMeals.map((m) => ({
                ...m,
                id: m._id,
                recipe_name: m.recipe?.name || "Recipe",
              }))
            );
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 p-8 md:p-10 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Culinary Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 font-heading">
              Welcome Back to Your <span className="text-gradient">AI Kitchen</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Track pantry inventory, schedule weekly meals, and generate gourmet recipes tailored to your exact taste.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/generate"
                className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Recipe
              </Link>
              <Link
                to="/pantry"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold px-6 py-3 rounded-xl hover:border-slate-600 transition-all text-sm"
              >
                <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                Manage Pantry
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={<ChefHat className="w-6 h-6 text-emerald-400" />}
            label="Total Recipes"
            value={stats.totalRecipes}
            badge="Saved Collection"
            accent="emerald"
          />
          <StatCard
            icon={<UtensilsCrossed className="w-6 h-6 text-teal-400" />}
            label="Pantry Items"
            value={stats.pantryItems}
            badge="In Stock"
            accent="teal"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6 text-purple-400" />}
            label="Meals Planned"
            value={stats.mealsThisWeek}
            badge="This Week"
            accent="purple"
          />
          <StatCard
            icon={<ShieldAlert className="w-6 h-6 text-amber-400" />}
            label="Expiring Soon"
            value={stats.expiringSoonCount}
            badge="Within 7 Days"
            accent="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Recipes */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">Recent Recipes</h2>
                  <p className="text-xs text-slate-400">Your latest saved culinary creations</p>
                </div>
              </div>
              <Link
                to="/recipes"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">Loading recent recipes...</div>
            ) : recentRecipes.length > 0 ? (
              <div className="space-y-3">
                {recentRecipes.map((recipe) => (
                  <Link
                    key={recipe.id || recipe._id}
                    to={`/recipes/${recipe.id || recipe._id}`}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 hover:bg-slate-900 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <ChefHat className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors text-sm truncate">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {(recipe.cook_time || recipe.cookTime || 0) + (recipe.prep_time || recipe.prepTime || 0)} mins
                        </span>
                        {recipe.cuisine_type && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                            {recipe.cuisine_type}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl">
                <ChefHat className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-400 mb-4">No saved recipes yet</p>
                <Link
                  to="/generate"
                  className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-all"
                >
                  Generate First Recipe
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Meals */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">Upcoming Meals</h2>
                  <p className="text-xs text-slate-400">Scheduled menu for the week</p>
                </div>
              </div>
              <Link
                to="/meal-plan"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <span>Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">Loading upcoming meals...</div>
            ) : upcomingMeals.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeals.map((meal) => (
                  <div
                    key={meal.id || meal._id}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-200 text-sm truncate">
                        {meal.recipe_name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 capitalize flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-medium">
                          {meal.meal_type}
                        </span>
                        <span>{meal.meal_date}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl">
                <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-400 mb-4">No upcoming meals scheduled</p>
                <Link
                  to="/meal-plan"
                  className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold px-4 py-2 rounded-xl hover:bg-purple-500/20 transition-all"
                >
                  Plan Weekly Menu
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, badge, accent }) => {
  const accentBorders = {
    emerald: "hover:border-emerald-500/40 shadow-emerald-950/10",
    teal: "hover:border-teal-500/40 shadow-teal-950/10",
    purple: "hover:border-purple-500/40 shadow-purple-950/10",
    amber: "hover:border-amber-500/40 shadow-amber-950/10",
  };

  return (
    <div className={`glass-panel rounded-3xl p-5 border border-slate-800/80 transition-all glass-panel-hover ${accentBorders[accent]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
          {badge}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-white tracking-tight font-heading">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
