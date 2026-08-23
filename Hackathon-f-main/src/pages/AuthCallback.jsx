import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2, AlertTriangle, Loader } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse parameters from both hash fragment and query search
        const hash = window.location.hash || "";
        const search = window.location.search || "";
        
        const hashParams = new URLSearchParams(hash.substring(1));
        const queryParams = new URLSearchParams(search);

        const error = hashParams.get("error") || queryParams.get("error");
        const errorCode = hashParams.get("error_code") || queryParams.get("error_code");
        const errorDescription = hashParams.get("error_description") || queryParams.get("error_description");

        if (error) {
          console.error("Auth callback redirect error:", error, errorCode, errorDescription);
          setStatus("error");
          if (errorCode === "otp_expired" || errorDescription?.includes("expired")) {
            setErrorMessage("This verification link has expired or has already been used.");
          } else {
            setErrorMessage(errorDescription || "Verification link is invalid.");
          }
          setLoading(false);
          return;
        }

        // Wait a brief moment to allow client-side Supabase client to parse URL parameters and establish session
        let session = null;
        for (let i = 0; i < 3; i++) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            session = data.session;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (session) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage("No active verification session was found. Please check your verification link or try logging in.");
        }
      } catch (err) {
        console.error("Verification processing failed:", err);
        setStatus("error");
        setErrorMessage("An unexpected error occurred during email verification.");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer z-10" onClick={() => navigate("/")}>
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-2 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight">BizPilot</span>
      </div>

      {/* Callback Card Container */}
      <div className="w-full max-w-md bg-white border border-gray-200 backdrop-blur-xl p-8 rounded-3xl z-10 shadow-2xl relative text-center">
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        {loading && (
          <div className="py-8 space-y-4 flex flex-col items-center">
            <Loader className="w-10 h-10 text-emerald-600 animate-spin" />
            <h2 className="text-xl font-display font-bold text-gray-900">Verifying your email</h2>
            <p className="text-gray-500 text-xs">Completing your BizPilot registration sync...</p>
          </div>
        )}

        {!loading && status === "success" && (
          <div className="py-4 space-y-6 flex flex-col items-center">
            <div className="bg-emerald-50 p-3 rounded-full border border-emerald-100">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-gray-900">Email verified successfully!</h2>
              <p className="text-gray-500 text-xs px-4">Your BizPilot account is now verified and active.</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl transition-all shadow-md text-xs cursor-pointer mt-4"
            >
              Continue to Login
            </button>
          </div>
        )}

        {!loading && status === "error" && (
          <div className="py-4 space-y-6 flex flex-col items-center">
            <div className="bg-red-50 p-3 rounded-full border border-red-100">
              <AlertTriangle className="w-12 h-12 text-red-650" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-display font-bold text-gray-900">Verification Link Expired</h2>
              <p className="text-red-650 text-xs px-4">{errorMessage}</p>
              <p className="text-gray-500 text-[10px] px-6">If you need a new link, please try registering again or contact support.</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-emerald-600 font-bold py-3 rounded-xl transition-all text-xs cursor-pointer mt-4"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
