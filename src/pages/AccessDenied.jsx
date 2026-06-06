import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Lock, Home } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Immersive Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-slate-900/60 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-center"
      >
        {/* Animated Icon Header */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500"
          >
            <ShieldAlert className="w-10 h-10" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-950 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 shadow-md"
          >
            <Lock className="w-4.5 h-4.5" />
          </motion.div>
        </div>

        {/* Text Details */}
        <h1 className="text-3xl font-black text-white tracking-tight mb-3">Access Denied</h1>
        <div className="w-12 h-1 bg-red-500/60 mx-auto rounded-full mb-6" />
        
        <p className="text-slate-300 text-base font-medium leading-relaxed mb-8">
          Your account does not possess the administrative clearance level required to access the BG Academy Console. Please verify your credentials or contact system operations.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3.5 bg-slate-950/40 hover:bg-slate-900/60 text-slate-200 border border-slate-800 hover:border-slate-700/80 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-red-500/15 hover:shadow-red-500/30 transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Student Dashboard</span>
          </button>
        </div>

        {/* Support Link */}
        <div className="mt-8 text-xs text-slate-500 font-medium">
          If you believe this is in error, contact support at{' '}
          <a href="mailto:ops@bgrealtyacademy.com" className="text-blue-400 hover:underline">
            ops@bgrealtyacademy.com
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
