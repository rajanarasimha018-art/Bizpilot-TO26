import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff, Loader, Sun, Moon } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login({ onLoginSuccess, user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [helperMessage, setHelperMessage] = useState("");

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("bizpilot-theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark mode styling class
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme-active");
      localStorage.setItem("bizpilot-theme", "dark");
    } else {
      document.body.classList.remove("dark-theme-active");
      localStorage.setItem("bizpilot-theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("bizpilot_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !password) {
      setError("Please fill out all credential fields.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: sbErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (sbErr) {
        throw sbErr;
      }

      const sessionUser = data.user;
      if (!sessionUser) {
        throw new Error("No user returned from authentication.");
      }

      if (rememberMe) {
        localStorage.setItem("bizpilot_remembered_email", cleanEmail);
      } else {
        localStorage.removeItem("bizpilot_remembered_email");
      }

      const meta = sessionUser.user_metadata || {};
      const profile = {
        email: sessionUser.email,
        name: meta.name || sessionUser.email.split("@")[0],
        businessName: meta.businessName || "BizPilot Business",
        businessType: meta.businessType || "Wholesale & Distribution",
        currency: meta.currency || "INR"
      };

      onLoginSuccess(profile);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failure:", err);
      let msg = "Invalid email or password.";
      if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    const demoEmail = "gamigrrider18@gmail.com";
    const demoPassword = "demo12345";

    try {
      const { data, error: sbErr } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      });
      if (sbErr) throw sbErr;

      const sessionUser = data.user;
      if (!sessionUser) {
        throw new Error("No user returned from authentication.");
      }

      const meta = sessionUser.user_metadata || {};
      const profile = {
        email: sessionUser.email,
        name: meta.name || sessionUser.email.split("@")[0],
        businessName: meta.businessName || "BizPilot Business",
        businessType: meta.businessType || "Wholesale & Distribution",
        currency: meta.currency || "INR"
      };

      onLoginSuccess(profile);
      navigate("/dashboard");
    } catch (err) {
      console.error("Demo login failure:", err);
      let msg = "Invalid email or password.";
      if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const demoEmailVal = import.meta.env.VITE_DEMO_EMAIL || "demo@bizpilot.ai";
  const demoPasswordVal = import.meta.env.VITE_DEMO_PASSWORD || "demo123456";

  const handleAutofillJudgeDemo = () => {
    setEmail(demoEmailVal);
    setPassword(demoPasswordVal);
    setHelperMessage("Demo credentials loaded");
    setTimeout(() => setHelperMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Decorative clean ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer z-10 animate-fade-in" onClick={() => navigate("/")}>
        <div className="bg-teal-700 p-2.5 rounded-xl shadow-md shadow-teal-700/10 hover:scale-105 active:scale-95 transition-all duration-300">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight brand-title-text text-slate-900">BizPilot</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-gray-250/80 p-8 rounded-3xl z-10 shadow-xl relative transition-all duration-300 animate-slide-up login-card-container">
        <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-teal-650 to-transparent" />

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle theme mode"
          className="absolute top-6 right-6 p-2 rounded-xl border border-gray-205 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-300 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-teal-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <h2 className="text-xl font-display font-bold text-slate-900 mb-1 text-center login-text-title">
          Welcome back to BizPilot
        </h2>
        <p className="text-gray-500 text-xs mb-6 text-center login-text-description">
          Your AI-powered business command center.
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-750 text-xs rounded-xl mb-6 transition-all duration-300 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5 login-text-label">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-450 transition-colors group-focus-within:text-teal-650" />
              <input
                type="email"
                required
                placeholder="e.g. name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-label="Email address input"
                className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none transition-all duration-300 text-slate-900 disabled:opacity-60 login-input-field"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 login-text-label">
                Security Password
              </label>
              <Link to="#" className="text-[10px] font-semibold text-teal-700 hover:text-teal-800 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-450 transition-colors group-focus-within:text-teal-650" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                aria-label="Password input"
                className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-10 text-xs focus:outline-none transition-all duration-300 text-slate-900 disabled:opacity-60 login-input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label="Toggle password visibility"
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 text-teal-650 focus:ring-teal-500 border-gray-350 rounded transition-all duration-350"
            />
            <label htmlFor="remember_me" className="ml-2.5 block text-xs text-gray-650 font-medium login-remember-me-text">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-label="Sign In button"
            className="w-full bg-teal-750 hover:bg-teal-850 active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-md shadow-teal-700/10 text-xs flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Pilot Sync...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-305 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 login-text-description">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-700 hover:text-teal-800 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 login-divider-line" />
          </div>
          <span className="relative bg-white px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest login-divider-text">
            or demo sandbox access
          </span>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-50 border border-gray-250 text-teal-800 font-bold py-2.5 rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] login-demo-btn"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-650" />
          <span>Launch Immediate High-Fidelity Sandbox</span>
        </button>

        {/* Judge Demo Access Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 login-divider-line transition-all duration-300 delay-200 animate-slide-up judge-demo-card bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4.5 h-4.5 text-teal-650 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 judge-demo-title">
              Judge Demo Account
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 mb-3 leading-normal judge-demo-text">
            Demo account provided for evaluation. Click the button below to pre-fill credentials.
          </p>
          <div className="space-y-1.5 mb-4 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-gray-150/50 dark:border-slate-800">
              <span className="text-[10px] uppercase font-sans font-bold text-gray-450 tracking-wider judge-demo-label">Email</span>
              <span className="text-[11px] font-medium text-slate-800 select-all px-1.5 py-0.5 rounded bg-gray-200/50 judge-demo-value">{demoEmailVal}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[10px] uppercase font-sans font-bold text-gray-450 tracking-wider judge-demo-label">Password</span>
              <span className="text-[11px] font-medium text-slate-800 select-all px-1.5 py-0.5 rounded bg-gray-200/50 judge-demo-value">••••••••••••</span>
            </div>
          </div>
          {helperMessage && (
            <p className="text-[10px] text-emerald-600 font-semibold text-center mb-3 animate-fade-in">
              {helperMessage}
            </p>
          )}
          <button
            type="button"
            onClick={handleAutofillJudgeDemo}
            className="w-full text-center bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold py-2 rounded-xl transition-all duration-300 text-[11px] cursor-pointer"
          >
            Use Demo Account
          </button>
        </div>
      </div>
    </div>
  );
}
