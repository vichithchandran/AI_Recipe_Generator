import { useState } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import { ChefHat, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  const resetToken = params.token || searchParams.get("token");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle requesting password reset email
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      toast.success(result.message || "Password reset instructions sent!");
    } else {
      toast.error(result.message || "Failed to send reset email");
    }
  };

  // Handle setting new password with reset token
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await resetPassword(resetToken, password);
    setLoading(false);

    if (result.success) {
      toast.success(result.message || "Password reset successful!");
      navigate("/login");
    } else {
      toast.error(result.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-radial-ambient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-xl shadow-emerald-500/20">
            <ChefHat className="w-9 h-9 text-slate-950" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            {resetToken ? (
              <>Set New <span className="text-gradient">Password</span></>
            ) : (
              <>Reset <span className="text-gradient">Password</span></>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {resetToken
              ? "Please enter your new account password"
              : "Enter your email to receive password reset instructions"}
          </p>
        </div>

        {/* Card Body */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 shadow-2xl">
          {resetToken ? (
            /* Set New Password Form */
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                >
                  New Password
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-sm"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : submitted ? (
            /* Email Sent Success View */
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Check Your Email</h2>
              <p className="text-sm text-slate-400">
                We have sent password reset instructions to{" "}
                <span className="font-semibold text-emerald-400">{email}</span>.
              </p>
              <p className="text-xs text-slate-500">
                Didn't receive the email? Check your spam folder or try submitting again.
              </p>
              <div className="pt-4 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Resend Email
                </button>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* Forgot Password Email Form */
            <form onSubmit={handleForgotSubmit} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Sending Email...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Send Reset Instructions</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
