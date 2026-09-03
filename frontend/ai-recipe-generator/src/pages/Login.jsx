import { Mail, Lock, Eye, EyeOff, Sparkles, FlaskConical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);

    const result = await demoLogin();

    if (result.success) {
      toast.success("Demo account ready — explore away!");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }

    setDemoLoading(false);
  };

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 bg-radial-ambient flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto sm:overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 my-auto">
          {/* Login Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800/80 shadow-2xl">
            {/* Header Inside Card */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                Welcome <span className="text-gradient">Back</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Sign in to access your AI Recipe Hub workspace
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end pt-0.5">
                <Link
                  to="/reset-password"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Shortcut */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading || loading}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 hover:text-amber-200 font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
              >
                <FlaskConical className="w-4 h-4" />
                <span>{demoLoading ? "Preparing demo account..." : "Try Demo — no sign-up needed"}</span>
              </button>
              <p className="text-center text-[11px] text-slate-500 mt-2 leading-relaxed">
                Explore a sample kitchen with recipes, pantry and meal plans already filled in.
              </p>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-slate-400 mt-5 pt-4 border-t border-slate-800/80">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="text-emerald-400 hover:text-emerald-300 font-bold ml-1 transition-colors"
              >
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
