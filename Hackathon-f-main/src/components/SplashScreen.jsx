import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Check } from "lucide-react";

const steps = [
  "Loading Dashboard",
  "Initializing AI Copilot",
  "Syncing Business Data",
  "Preparing Analytics",
  "Launching Workspace"
];

export default function SplashScreen({ onComplete }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, 0]);
      setActiveStep(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, 0, 1]);
      setActiveStep(2);
    }, 1000);

    const timer3 = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, 0, 1, 2]);
      setActiveStep(3);
    }, 1500);

    const timer4 = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, 0, 1, 2, 3]);
      setActiveStep(4);
    }, 2000);

    const timer5 = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, 0, 1, 2, 3, 4]);
      setActiveStep(5);
    }, 2500);

    const timer6 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2850);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-gradient-to-tr from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center p-6 select-none pointer-events-auto"
    >
      {/* Premium Subtle Panning Grid Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px"],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "linear",
        }}
      />

      {/* Decorative Radial Light Mask */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(255,255,255,0.7)_100%)] pointer-events-none" />

      {/* Center Panel Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Premium Logo Wrapper */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-5 shadow-xl shadow-emerald-500/10"
        >
          <Sparkles className="w-10 h-10 text-white" />
          
          {/* Animated Glow Border */}
          <motion.div
            className="absolute inset-0 rounded-2xl border border-emerald-400/40"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Title and Subtitle */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="text-3xl font-extrabold tracking-tight text-gray-900 font-display"
        >
          BizPilot
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-600/95 mt-2 font-sans"
        >
          AI Business Command Center
        </motion.p>

        {/* Loading Progress Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="w-full mt-10 space-y-6"
        >
          {/* Custom Premium Progress Bar */}
          <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden p-[1px] border border-gray-250/20">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>

          {/* Steps List */}
          <div className="flex flex-col space-y-3.5 pl-2 text-left w-full max-w-[280px] mx-auto">
            {steps.map((step, idx) => {
              const isCompleted = completedSteps.includes(idx);
              const isActive = activeStep === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{
                    opacity: isCompleted || isActive ? 1 : 0.25,
                    x: 0,
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 text-[13px] font-medium transition-all"
                >
                  {isCompleted ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="text-emerald-600 flex items-center justify-center w-5 h-5 bg-emerald-50 rounded-full border border-emerald-100/80 shadow-sm"
                    >
                      <Check className="w-3 h-3 stroke-[3px]" />
                    </motion.span>
                  ) : isActive ? (
                    <span className="flex items-center justify-center w-5 h-5 relative">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center text-gray-300 font-mono text-[10px] font-bold">
                      •
                    </span>
                  )}
                  
                  <span
                    className={`font-sans tracking-wide transition-colors duration-200 ${
                      isCompleted
                        ? "text-gray-800 font-semibold"
                        : isActive
                        ? "text-emerald-700 font-bold"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
