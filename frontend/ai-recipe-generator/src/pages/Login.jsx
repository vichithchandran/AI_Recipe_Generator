import { ChefHat, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-xl shadow-emerald-500/20">
            <ChefHat className="w-9 h-9 text-slate-950" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Welcome <span className="text-gradient">Back</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Sign in to access your AI Recipe Generator workspace
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email*/}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-sm"
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
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full pl-11 pr-11 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-sm"
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
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password*/}
            <div className="flex items-center justify-end">
              <Link
                to="/reset-password"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button*/}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
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

          {/* Sign Up Link */}
          <p className="text-center text-xs text-slate-400 mt-6 pt-6 border-t border-slate-800/80">
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
  );
};

export default Login;
