import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff, Loader } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login({ onLoginSuccess, user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Decorative clean ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer z-10" onClick={() => navigate("/")}>
        <div className="bg-teal-700 p-2.5 rounded-xl shadow-md shadow-teal-700/10">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-slate-900">BizPilot</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-gray-250/80 p-8 rounded-3xl z-10 shadow-xl relative transition-all duration-300">
        <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-teal-650 to-transparent" />

        <h2 className="text-xl font-display font-bold text-slate-900 mb-1 text-center">
          Welcome back to BizPilot
        </h2>
        <p className="text-gray-500 text-xs mb-6 text-center">
          Your AI-powered business command center.
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
              <input
                type="email"
                required
                placeholder="e.g. name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none transition-colors text-slate-900 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Security Password
              </label>
              <Link to="#" className="text-[10px] font-semibold text-teal-700 hover:text-teal-800 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-10 text-xs focus:outline-none transition-colors text-slate-900 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
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
              className="h-4 w-4 text-teal-650 focus:ring-teal-500 border-gray-350 rounded"
            />
            <label htmlFor="remember_me" className="ml-2.5 block text-xs text-gray-600 font-medium">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-750 hover:bg-teal-850 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-teal-700/10 text-xs flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Pilot Sync...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-700 hover:text-teal-800 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            or demo sandbox access
          </span>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-50 border border-gray-250 text-teal-800 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-650" />
          <span>Launch Immediate High-Fidelity Sandbox</span>
        </button>
      </div>
    </div>
  );
}
