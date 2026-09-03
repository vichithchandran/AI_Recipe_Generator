import { useState } from "react";
import { FlaskConical, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DISMISS_KEY = "demoBannerDismissed";

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === "true";
  } catch {
    // Private browsing or blocked site data — just show the banner.
    return false;
  }
};

/**
 * Shown across the app while signed in to the shared demo account.
 * Dismissal is remembered per browser until the next demo sign-in.
 */
const DemoBanner = () => {
  const { isDemo } = useAuth();
  const [dismissed, setDismissed] = useState(readDismissed);

  if (!isDemo || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // Not remembering the dismissal is acceptable; hiding it now is enough.
    }
  };

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/25 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2.5">
          <span className="flex items-center gap-2 shrink-0 text-amber-300">
            <FlaskConical className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Demo mode</span>
          </span>

          <p className="flex-1 min-w-0 text-xs text-amber-100/80 leading-relaxed">
            You're exploring a shared sample account — data resets periodically, so
            edit anything you like.{" "}
            <Link
              to="/signup"
              className="font-bold text-amber-200 underline underline-offset-2 hover:text-white transition-colors"
            >
              Create a free account
            </Link>{" "}
            to keep your own recipes.
          </p>

          <button
            onClick={dismiss}
            aria-label="Dismiss demo mode notice"
            className="shrink-0 p-1.5 rounded-lg text-amber-300/70 hover:text-amber-100 hover:bg-amber-500/15 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
