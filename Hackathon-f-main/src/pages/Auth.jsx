import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, ArrowRight, Lock, Mail, User, Building, Loader } from "lucide-react";

export default function Auth( { onLoginSuccess, user } ) {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const initialMode = searchParams.get( "mode" ) === "register" ? "register" : "login";
  const [ mode, setMode ] = useState( "login" );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( "" );
  const [ email, setEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ name, setName ] = useState( "" );
  const [ businessName, setBusinessName ] = useState( "" );
  const [ businessType, setBusinessType ] = useState( "Wholesale & Distribution" );
  const [ currency, setCurrency ] = useState( "USD" );

  useEffect( () => {
    setMode( initialMode );
  }, [ initialMode ] );

  useEffect( () => {
    if ( user ) {
      navigate( "/dashboard" );
    }
  }, [ user, navigate ] );

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    setError( "" );
    setLoading( true );

    const cleanEmail = email.toLowerCase().trim() || "demo@bizpilot.co";
    const cleanPassword = password || "demo12345";
    const cleanName = name.trim() || "Siddu";
    const cleanBusinessName = businessName.trim() || "BizPilot";

    try {
      const payload = {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        businessName: cleanBusinessName,
        businessType: businessType,
        currency: currency
      };

      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch( endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( payload )
      } );
      const data = await res.json();
      if ( !res.ok ) {
        throw new Error( data.error || "Backend synchronization failed" );
      }

      localStorage.setItem( "bizpilot_profile", JSON.stringify( data.profile ) );
      onLoginSuccess( data.profile );
      navigate( "/dashboard" );
    } catch ( err ) {
      console.error( "Demo login fail, fallback:", err );
      const demoUser = {
        name: cleanName,
        email: cleanEmail,
        businessName: cleanBusinessName,
        businessType: businessType,
        currency: currency
      };
      localStorage.setItem( "bizpilot_profile", JSON.stringify( demoUser ) );
      onLoginSuccess( demoUser );
      navigate( "/dashboard" );
    } finally {
      setLoading( false );
    }
  };

  const handleDemoLogin = async () => {
    setLoading( true );
    setError( "" );
    const demoEmail = "gamigrrider18@gmail.com";
    const demoPassword = "demo12345";

    try {
      const res = await fetch( "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( {
          email: demoEmail,
          password: demoPassword
        } )
      } );
      const data = await res.json();
      if ( !res.ok ) {
        throw new Error( data.error || "Demo backend sync failed" );
      }

      localStorage.setItem( "bizpilot_profile", JSON.stringify( data.profile ) );
      onLoginSuccess( data.profile );
      navigate( "/dashboard" );
    } catch ( err ) {
      console.error( "Demo login fail, fallback:", err );
      const demoUser = {
        name: "Siddu",
        email: demoEmail,
        businessName: "Gamig Solar Solutions",
        businessType: "Solar Energy Systems & Green Technology",
        currency: "INR"
      };
      localStorage.setItem( "bizpilot_profile", JSON.stringify( demoUser ) );
      onLoginSuccess( demoUser );
      navigate( "/dashboard" );
    } finally {
      setLoading( false );
    }
  };

  return <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
    {/* Glow Effects */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

    {/* Brand Header */}
    <div className="flex items-center gap-3 mb-8 cursor-pointer z-10" onClick={() => navigate( "/" )}>
      <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-2 rounded-xl">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <span className="font-display font-bold text-2xl tracking-tight">BIzPilot</span>
    </div>

    {/* Main Auth Container */}
    <div className="w-full max-w-lg bg-white border border-gray-200 backdrop-blur-xl p-8 rounded-3xl z-10 shadow-2xl relative">
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

      {/* Toggle Mode Tab */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setMode( "login" )}
          className={`flex-1 pb-3 text-sm font-semibold transition-all ${ mode === "login" ? "text-indigo-600 border-b-2 border-indigo-500" : "text-gray-500 hover:text-gray-800" }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode( "register" )}
          className={`flex-1 pb-3 text-sm font-semibold transition-all ${ mode === "register" ? "text-indigo-600 border-b-2 border-indigo-500" : "text-gray-500 hover:text-gray-800" }`}
        >
          Create Account
        </button>
      </div>

      <h2 className="text-xl font-display font-bold mb-2">
        {mode === "login" ? "Welcome back, Operator" : "Configure Your Profile"}
      </h2>
      <p className="text-gray-500 text-xs mb-6">
        {mode === "login" ? "Enter your credentials to manage your Business Command Center." : "Set up your business parameters and profile details."}
      </p>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-650 text-xs rounded-xl mb-6">
        {error}
      </div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && <>
          {/* Profile Name */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
              <input
                type="text"
                placeholder="e.g. Alex Mercer"
                value={name}
                onChange={( e ) => setName( e.target.value )}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:border-indigo-500 focus:outline-none transition-colors text-gray-900"
              />
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Business / Enterprise Name</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
              <input
                type="text"
                placeholder="e.g. Brewmaster Wholesale Supplies"
                value={businessName}
                onChange={( e ) => setBusinessName( e.target.value )}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:border-indigo-500 focus:outline-none transition-colors text-gray-900"
              />
            </div>
          </div>

          {/* Business Type & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Enterprise Type</label>
              <select
                value={businessType}
                onChange={( e ) => setBusinessType( e.target.value )}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:border-indigo-500 focus:outline-none transition-colors text-gray-800"
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
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Currency Code</label>
              <select
                value={currency}
                onChange={( e ) => setCurrency( e.target.value )}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:border-indigo-500 focus:outline-none transition-colors text-gray-800"
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
        </>}

        {/* Email Address */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
            <input
              type="email"
              placeholder="e.g. alex@brewmaster.com"
              value={email}
              onChange={( e ) => setEmail( e.target.value )}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:border-indigo-500 focus:outline-none transition-colors text-gray-900"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">Security Password</label>
            {mode === "login" && <span className="text-[10px] text-indigo-600 hover:underline cursor-pointer">Forgot?</span>}
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={( e ) => setPassword( e.target.value )}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:border-indigo-500 focus:outline-none transition-colors text-gray-900"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer mt-6"
        >
          {loading ? <>
            <Loader className="w-3.5 h-3.5 animate-spin" />
            <span>Processing Pilot Sync...</span>
          </> : <>
            <span>Launch Demo Workspace</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </>}
        </button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <span className="relative bg-white px-3.5 text-[10px] font-bold text-gray-450 uppercase tracking-widest">or demo instant access</span>
      </div>

      {/* Demo Shortcut Sandbox */}
      <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-indigo-600 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>Launch Immediate High-Fidelity Sandbox</span>
      </button>
    </div>
  </div>;
}
