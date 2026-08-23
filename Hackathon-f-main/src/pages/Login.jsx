import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login({ onLoginSuccess, user }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
    const remembered = localStorage.getItem("bizpilot_remembered_email");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, [user, navigate]);

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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer z-10" onClick={() => navigate("/")}>
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-2 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight">BizPilot</span>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-md bg-white border border-gray-200 backdrop-blur-xl p-8 rounded-3xl z-10 shadow-2xl relative">
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        <h2 className="text-2xl font-display font-bold mb-1.5 text-gray-900">Welcome back to BizPilot</h2>
        <p className="text-gray-500 text-xs mb-6">Your AI-powered business command center.</p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-750 text-xs rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="e.g. name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">Password</label>
              <span className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer">Forgot password?</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-10 text-xs focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-600">
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin" />
                <span>Entering command center...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Link to Sign Up */}
        <div className="mt-6 text-center">
          <span className="text-xs text-gray-500">Don't have an account? </span>
          <Link to="/signup" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold">Create one</Link>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <span className="relative bg-white px-3.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">or demo instant access</span>
        </div>

        {/* Instant Sandbox Button */}
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-emerald-600 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Launch Immediate High-Fidelity Sandbox</span>
        </button>
      </div>
    </div>
  );
}
