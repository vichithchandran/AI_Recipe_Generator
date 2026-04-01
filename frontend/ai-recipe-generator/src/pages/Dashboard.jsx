import { Calendar, ChefHat, Clock, UtensilsCrossed } from "lucide-react";
import Navbar from "../components/Navbar";
import {
  dummyStats,
  getRecentRecipes,
  getUpcomingMeals,
} from "../data/dummyData";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    pantryItems: 0,
    mealsThisWeek: 0,
  });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [upcomingMeals, setUpcomingMeals] = useState([]);

  useEffect(() => {
    setStats({
      totalRecipes: dummyStats.recipes.total_recipes,
      pantryItems: dummyStats.pantry.total_items,
      mealsThisWeek: dummyStats.mealPlans.this_week_count,
    });
    setRecentRecipes(getRecentRecipes(5));
    setUpcomingMeals(getUpcomingMeals(5));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome Back! Here's your cooking overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<ChefHat className="w-6 h-6" />}
            label="Total Recipes"
            color="emerald"
            value={stats.totalRecipes}
          />
          <StatCard
            icon={<UtensilsCrossed className="w-6 h-6" />}
            label="Pantry items"
            color="blue"
            value={stats.pantryItems}
          />
          <StatCard
            icon={<ChefHat className="w-6 h-6" />}
            label="Meals This Weak"
            color="purple"
            value={stats.mealsThisWeek}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-8 gap-6">
          <Link
            to="/generate"
            className="bg-linear-to-r from-emerald-50 to-emerald-100 text-emerald-500 p-6 rounded-xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg">Generate Recipe</h3>
                <p className="text-emerald-800 text-sm">
                  Create AI-powered recipes
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/generate"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg">Manage Pantry</h3>
                <p className="text-gray-600 text-sm">
                  Add and track ingredients
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Recipes & Upcomng Meals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Recipes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">Recent Recipes</h2>
              <Link
                to="/recipes"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View all
              </Link>
            </div>

            {recentRecipes.length > 0 ? (
              <div className="space-y-3">
                {recentRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {recipe.name}
                      </h3>
                      <p className=" text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.cook_time} mins
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recipes yet. Generate your first one!
              </p>
            )}
          </div>

          {/* upcomingMeals */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">Upcoming Meals</h2>
              <Link
                to="/meal-plan"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View calendar
              </Link>
            </div>
            {upcomingMeals.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeals.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {meal.recipe_name}
                      </h3>
                      <p className=" text-sm text-gray-500 capitalize">
                        {meal.meal_type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recipes yet. Generate your first one!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className=" text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 ">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
