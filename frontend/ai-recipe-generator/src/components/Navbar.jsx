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
  Globe,
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
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all shrink-0">
              <ChefHat className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight font-heading whitespace-nowrap">
              AI Recipe <span className="text-emerald-400 font-extrabold">Hub</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 shrink-0 overflow-x-auto">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  active={location.pathname === "/dashboard"}
                  icon={<Home className="w-4 h-4 shrink-0" />}
                  label="Dashboard"
                />
                <NavLink
                  to="/pantry"
                  active={location.pathname === "/pantry"}
                  icon={<UtensilsCrossed className="w-4 h-4 shrink-0" />}
                  label="Pantry"
                />
                <NavLink
                  to="/generate"
                  active={location.pathname === "/generate"}
                  icon={<Sparkles className="w-4 h-4 shrink-0" />}
                  label="AI Generator"
                  highlight
                />
                <NavLink
                  to="/community"
                  active={location.pathname === "/community"}
                  icon={<Globe className="w-4 h-4 shrink-0" />}
                  label="Community"
                />
                <NavLink
                  to="/recipes"
                  active={location.pathname.startsWith("/recipes")}
                  icon={<ChefHat className="w-4 h-4 shrink-0" />}
                  label="My Recipes"
                />
                <NavLink
                  to="/meal-plan"
                  active={location.pathname === "/meal-plan"}
                  icon={<Calendar className="w-4 h-4 shrink-0" />}
                  label="Meal Plan"
                />
                <NavLink
                  to="/shopping-list"
                  active={location.pathname === "/shopping-list"}
                  icon={<ShoppingCart className="w-4 h-4 shrink-0" />}
                  label="Shopping"
                />
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  active={location.pathname === "/"}
                  icon={<Home className="w-4 h-4 shrink-0" />}
                  label="Home"
                />
                <NavLink
                  to="/community"
                  active={location.pathname === "/community"}
                  icon={<Globe className="w-4 h-4 shrink-0" />}
                  label="Community Recipes"
                />
                <NavLink
                  to="/generate"
                  active={location.pathname === "/generate"}
                  icon={<Sparkles className="w-4 h-4 shrink-0" />}
                  label="AI Generator"
                  highlight
                />
              </>
            )}
          </nav>

          {/* User Menu / Auth Controls */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-medium text-slate-300 max-w-24 lg:max-w-32 truncate whitespace-nowrap">
                    {user.name || user.email}
                  </span>
                </div>

                <Link
                  to="/settings"
                  className={`p-2 rounded-xl border transition-all shrink-0 ${
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
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 rounded-xl transition-all shrink-0 cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all whitespace-nowrap"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-extrabold text-slate-950 bg-linear-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 rounded-xl shadow-md transition-all whitespace-nowrap"
                >
                  Get Started Free
                </Link>
              </>
            )}
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
      className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
        active
          ? highlight
            ? "bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20"
            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : highlight
          ? "text-emerald-400 hover:bg-emerald-500/10"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
};

export default Navbar;
