import { useState, useEffect } from "react";
import { User, Lock, Trash2, Save, Eye, EyeOff, Sliders, Coffee, UtensilsCrossed, Apple, Moon } from "lucide-react";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

const MEAL_TYPES = [
  {
    id: "breakfast",
    label: "Breakfast",
    description: "Morning fuel to kickstart your day",
    time: "6 AM – 10 AM",
    icon: Coffee,
    color: "amber",
    emoji: "🌅",
  },
  {
    id: "lunch",
    label: "Lunch",
    description: "Midday meal to keep you energised",
    time: "12 PM – 3 PM",
    icon: UtensilsCrossed,
    color: "emerald",
    emoji: "☀️",
  },
  {
    id: "snack",
    label: "Snack",
    description: "Light bites between main meals",
    time: "3 PM – 6 PM",
    icon: Apple,
    color: "orange",
    emoji: "🍎",
  },
  {
    id: "dinner",
    label: "Dinner",
    description: "Evening feast to end the day right",
    time: "7 PM – 10 PM",
    icon: Moon,
    color: "violet",
    emoji: "🌙",
  },
];

const MEAL_COLOR_MAP = {
  amber: {
    active: "bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-amber-500/15",
    inactive: "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300",
    icon: "bg-amber-500/15 text-amber-400",
    iconInactive: "bg-slate-800 text-slate-500",
    dot: "bg-amber-400",
    time: "text-amber-400/70",
  },
  emerald: {
    active: "bg-emerald-500/20 border-emerald-400/60 text-emerald-300 shadow-emerald-500/15",
    inactive: "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300",
    icon: "bg-emerald-500/15 text-emerald-400",
    iconInactive: "bg-slate-800 text-slate-500",
    dot: "bg-emerald-400",
    time: "text-emerald-400/70",
  },
  orange: {
    active: "bg-orange-500/20 border-orange-400/60 text-orange-300 shadow-orange-500/15",
    inactive: "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300",
    icon: "bg-orange-500/15 text-orange-400",
    iconInactive: "bg-slate-800 text-slate-500",
    dot: "bg-orange-400",
    time: "text-orange-400/70",
  },
  violet: {
    active: "bg-violet-500/20 border-violet-400/60 text-violet-300 shadow-violet-500/15",
    inactive: "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300",
    icon: "bg-violet-500/15 text-violet-400",
    iconInactive: "bg-slate-800 text-slate-500",
    dot: "bg-violet-400",
    time: "text-violet-400/70",
  },
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
const CUISINES = [
  "Any",
  "Kerala",
  "South Indian",
  "Tamil Nadu",
  "Karnataka",
  "Andhra",
  "Indian",
  "North Indian",
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "French",
  "Mediterranean",
  "American",
];

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Confirm Modal State for Account Deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    dietary_restrictions: [],
    allergies: [],
    preferred_cuisines: [],
    meal_preferences: ["breakfast", "lunch", "snack", "dinner"],
    default_servings: 4,
    measurement_unit: "metric",
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
      });
    }

    const loadPreferences = async () => {
      try {
        const res = await userService.getPreferences();
        if (res.success && res.data) {
          setPreferences({
            dietary_restrictions: res.data.dietary_restrictions || [],
            allergies: res.data.allergies || [],
            preferred_cuisines: res.data.preferred_cuisines || [],
            meal_preferences: res.data.meal_preferences || ["breakfast", "lunch", "snack", "dinner"],
            default_servings: res.data.default_servings || 4,
            measurement_unit: res.data.measurement_unit || "metric",
          });
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userService.updateProfile(profile.name);
      if (res.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    setSavingPreferences(true);
    try {
      const res = await userService.updatePreferences(preferences);
      if (res.success) {
        toast.success("Preferences updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update preferences");
    } finally {
      setSavingPreferences(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (res.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const confirmAccountDeletion = async () => {
    try {
      const res = await userService.deleteAccount("DELETE");
      if (res.success) {
        toast.success("Account deleted successfully");
        logout();
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const toggleDietary = (option) => {
    setPreferences((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(option)
        ? prev.dietary_restrictions.filter((d) => d !== option)
        : [...prev.dietary_restrictions, option],
    }));
  };

  const toggleCuisine = (cuisine) => {
    setPreferences((prev) => ({
      ...prev,
      preferred_cuisines: prev.preferred_cuisines.includes(cuisine)
        ? prev.preferred_cuisines.filter((c) => c !== cuisine)
        : [...prev.preferred_cuisines, cuisine],
    }));
  };

  const toggleMealPreference = (mealId) => {
    setPreferences((prev) => ({
      ...prev,
      meal_preferences: prev.meal_preferences.includes(mealId)
        ? prev.meal_preferences.filter((m) => m !== mealId)
        : [...prev.meal_preferences, mealId],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Account <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your personal profile, security, and default AI preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-heading">Profile Information</h2>
                <p className="text-xs text-slate-400">Update your account name and view email address</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800/60 rounded-xl text-slate-500 cursor-not-allowed outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all text-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingProfile ? "Saving Profile..." : "Save Profile"}
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-heading">Security & Password</h2>
                <p className="text-xs text-slate-400">Update your access password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-xs disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {changingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Preferences Section */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <Sliders className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-heading">Culinary & AI Defaults</h2>
                <p className="text-xs text-slate-400">Pre-populate restrictions and preferred cuisines</p>
              </div>
            </div>

            <form onSubmit={handlePreferencesUpdate} className="space-y-6">
              {/* Dietary Restrictions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Dietary Restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleDietary(option)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        preferences.dietary_restrictions.includes(option)
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  value={preferences.allergies.join(", ")}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      allergies: e.target.value
                        .split(",")
                        .map((a) => a.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. peanuts, shellfish, soy"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm"
                />
              </div>

              {/* Preferred Cuisines */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Preferred Cuisines
                </label>
                <div className="flex flex-wrap gap-2">
                  {CUISINES.map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleCuisine(cuisine)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        preferences.preferred_cuisines.includes(cuisine)
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Preference Selection */}
              <div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Meal Preferences
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select the meal types you want AI recipes generated for
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MEAL_TYPES.map((meal) => {
                    const isActive = preferences.meal_preferences.includes(meal.id);
                    const colors = MEAL_COLOR_MAP[meal.color];
                    const Icon = meal.icon;
                    return (
                      <button
                        key={meal.id}
                        type="button"
                        onClick={() => toggleMealPreference(meal.id)}
                        className={`relative group flex flex-col gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 shadow-lg ${
                          isActive
                            ? `${colors.active} shadow-lg`
                            : colors.inactive
                        }`}
                      >
                        {/* Active dot indicator */}
                        {isActive && (
                          <span
                            className={`absolute top-3 right-3 w-2 h-2 rounded-full ${colors.dot} shadow-sm`}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isActive ? colors.icon : colors.iconInactive
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>

                        {/* Label + Emoji */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold leading-none">{meal.label}</span>
                            <span className="text-sm leading-none">{meal.emoji}</span>
                          </div>
                          <p className="text-[11px] mt-1 opacity-70 leading-snug">{meal.description}</p>
                        </div>

                        {/* Time badge */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg self-start ${
                            isActive
                              ? `${colors.time} bg-white/5`
                              : "text-slate-600 bg-slate-800/50"
                          }`}
                        >
                          {meal.time}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Summary pill */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Active:</span>
                  {preferences.meal_preferences.length === 0 ? (
                    <span className="text-[11px] text-red-400 font-semibold">None selected</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {MEAL_TYPES.filter((m) => preferences.meal_preferences.includes(m.id)).map(
                        (m) => (
                          <span
                            key={m.id}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {m.emoji} {m.label}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Default Servings */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Default Servings</span>
                  <span className="text-emerald-400 font-bold">{preferences.default_servings} people</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={preferences.default_servings}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      default_servings: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Measurement Unit */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                  Measurement System
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        measurement_unit: "metric",
                      })
                    }
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      preferences.measurement_unit === "metric"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    Metric (kg, L)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        measurement_unit: "imperial",
                      })
                    }
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      preferences.measurement_unit === "imperial"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    Imperial (lb, gal)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPreferences}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all text-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingPreferences ? "Saving Preferences..." : "Save Preferences"}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="glass-panel rounded-3xl p-6 border border-red-500/30 bg-red-500/5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-red-200 font-heading">Danger Zone</h2>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Permanently delete your account and remove all saved recipes, pantry inventory, and scheduled meal plans.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-xs"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmAccountDeletion}
        title="Permanently Delete Account"
        message="This action is permanent and cannot be reversed. All your recipes, pantry items, and meal plans will be deleted."
        confirmText="Delete Account"
        variant="danger"
        promptWord="DELETE"
      />
    </div>
  );
};

export default Settings;
