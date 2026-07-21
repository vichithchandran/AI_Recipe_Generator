import {
  ChefHat,
  Home,
  LogOut,
  Settings,
  ShoppingCart,
  UtensilsCrossed,
  Sparkles,
  Calendar,
  User,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <ChefHat className="w-6 h-6 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 font-heading">
                AI Recipe <span className="text-emerald-400 font-extrabold">Hub</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            <NavLink
              to="/dashboard"
              active={location.pathname === "/dashboard"}
              icon={<Home className="w-4 h-4" />}
              label="Dashboard"
            />
            <NavLink
              to="/pantry"
              active={location.pathname === "/pantry"}
              icon={<UtensilsCrossed className="w-4 h-4" />}
              label="Pantry"
            />
            <NavLink
              to="/generate"
              active={location.pathname === "/generate"}
              icon={<Sparkles className="w-4 h-4" />}
              label="AI Generator"
              highlight
            />
            <NavLink
              to="/recipes"
              active={location.pathname.startsWith("/recipes")}
              icon={<ChefHat className="w-4 h-4" />}
              label="My Recipes"
            />
            <NavLink
              to="/meal-plan"
              active={location.pathname === "/meal-plan"}
              icon={<Calendar className="w-4 h-4" />}
              label="Meal Plan"
            />
            <NavLink
              to="/shopping-list"
              active={location.pathname === "/shopping-list"}
              icon={<ShoppingCart className="w-4 h-4" />}
              label="Shopping"
            />
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-xs font-medium text-slate-300 max-w-28 truncate">
                  {user.name || user.email}
                </span>
              </div>
            )}

            <Link
              to="/settings"
              className={`p-2 rounded-xl border transition-all ${
                location.pathname === "/settings"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 rounded-xl transition-all"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, active, icon, label, highlight }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
        active
          ? highlight
            ? "bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20"
            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : highlight
          ? "text-emerald-400 hover:bg-emerald-500/10"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
