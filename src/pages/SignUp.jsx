import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, Lock, Mail, User, Building, Loader } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function SignUp({ onLoginSuccess, user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Wholesale & Distribution");
  const [currency, setCurrency] = useState("USD");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.toLowerCase().trim();

    if (!name || !cleanEmail || !password || !businessName) {
      setError("Please fill out all credentials and business details.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

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
    <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer z-10" onClick={() => navigate("/")}>
        <div className="bg-teal-700 p-2.5 rounded-xl shadow-md shadow-teal-700/10">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-slate-900">BizPilot</span>
      </div>

      {/* Sign Up Card */}
      <div className="w-full max-w-lg bg-white border border-gray-250/80 p-8 rounded-3xl z-10 shadow-xl relative transition-all duration-300">
        <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-teal-650 to-transparent" />

        <h2 className="text-xl font-display font-bold text-slate-900 mb-1 text-center">
          Create BizPilot Account
        </h2>
        <p className="text-gray-500 text-xs mb-6 text-center">
          Set up your business parameters and profile details.
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                Your Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none transition-colors text-slate-900 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                Business / Enterprise Name
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Brewmaster Supplies"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none transition-colors text-slate-900 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                Enterprise Type
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                disabled={loading}
                className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none transition-colors text-slate-700 disabled:opacity-60"
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
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                Currency Code
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={loading}
                className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none transition-colors text-slate-700 disabled:opacity-60"
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

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
              <input
                type="email"
                required
                placeholder="e.g. alex@brewmaster.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none transition-colors text-slate-900 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none transition-colors text-slate-900 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none transition-colors text-slate-900 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-750 hover:bg-teal-850 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-teal-700/10 text-xs flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin" />
                <span>Creating AI Business Pilot...</span>
              </>
            ) : (
              <>
                <span>Create BizPilot Account</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-700 hover:text-teal-800 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
