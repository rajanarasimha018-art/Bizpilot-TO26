import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, User, Building, Mail, Lock, Eye, EyeOff, Loader, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function SignUp({ onLoginSuccess, user }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Wholesale & Distribution");
  const [currency, setCurrency] = useState("INR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();

    if (!name || !cleanEmail || !password || !businessName) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: sbErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            name: name,
            businessName: businessName,
            businessType: businessType,
            currency: currency
          }
        }
      });

      if (sbErr) {
        throw sbErr;
      }

      if (data.session) {
        const meta = data.user.user_metadata || {};
        const profile = {
          email: data.user.email,
          name: meta.name || data.user.email.split("@")[0],
          businessName: meta.businessName || "BizPilot Business",
          businessType: meta.businessType || "Wholesale & Distribution",
          currency: meta.currency || "INR"
        };
        onLoginSuccess(profile);
        navigate("/dashboard");
      } else {
        setError("");
        alert("Account created successfully! Please check your email to confirm your registration.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      let msg = "Failed to create account.";
      if (err.message?.includes("already registered") || err.message?.includes("already in use") || err.message?.includes("Email already in use")) {
        msg = "This email is already registered.";
      } else if (err.message?.includes("weak-password") || err.message?.includes("should be at least 6 characters") || err.status === 400) {
        msg = "Password must be at least 6 characters.";
      } else {
        msg = err.message || msg;
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

      {/* Sign Up Card Container */}
      <div className="w-full max-w-md bg-white border border-gray-200 backdrop-blur-xl p-8 rounded-3xl z-10 shadow-2xl relative">
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        <h2 className="text-2xl font-display font-bold mb-1.5 text-gray-900">Create BizPilot Account</h2>
        <p className="text-gray-500 text-xs mb-6">Set up your business parameters and profile details.</p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-750 text-xs rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g. Siddu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
              />
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Business / Enterprise Name</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g. Gamig Solar Solutions"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
              />
            </div>
          </div>

          {/* Business Type & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Enterprise Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:border-emerald-500 focus:outline-none transition-colors text-gray-800"
              >
                <option value="Wholesale & Distribution">Wholesale & Dist.</option>
                <option value="Retail Boutique">Retail Boutique</option>
                <option value="Local Manufacturing">Manufacturing</option>
                <option value="Small Startup">Tech Startup</option>
                <option value="Services & Consulting">Services</option>
                <option value="Healthcare & Pharmacy">Healthcare / Pharmacy</option>
                <option value="Logistics & Transport">Logistics / Transport</option>
                <option value="Construction & Materials">Construction / Materials</option>
                <option value="Restaurant & Food Service">Restaurant / Food Service</option>
                <option value="Solar Energy Systems & Green Technology">Green Tech / Solar</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Currency Code</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:border-emerald-500 focus:outline-none transition-colors text-gray-800"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>

          {/* Email Address */}
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

          {/* Password */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password (min 6 characters)"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-10 text-xs focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin" />
                <span>Launching Business Pilot...</span>
              </>
            ) : (
              <>
                <span>Create BizPilot Account</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Link back to Login */}
        <div className="mt-6 text-center">
          <span className="text-xs text-gray-500">Already have an account? </span>
          <Link to="/login" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
