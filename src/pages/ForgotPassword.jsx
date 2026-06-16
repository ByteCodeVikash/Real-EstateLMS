import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';

const BGLogo = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="forgot-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CFAE5D" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#E5C76B" />
      </linearGradient>
      <linearGradient id="forgot-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A66C2" />
        <stop offset="100%" stopColor="#1E88E5" />
      </linearGradient>
    </defs>
    <path d="M15 90V55L40 40V90H15Z" fill="url(#forgot-gold)" />
    <path d="M45 90V25L70 12V90H45Z" fill="url(#forgot-gold)" opacity="0.95" />
    <path d="M75 90V48L95 36V90H75Z" fill="url(#forgot-gold)" opacity="0.85" />
    <path d="M100 90V65L115 55V90H100Z" fill="url(#forgot-gold)" opacity="0.75" />
    <path d="M52 32H63V38H52V32ZM52 46H63V52H52V46ZM52 60H63V66H52V60ZM52 74H63V80H52V74Z" fill="#050505" opacity="0.8" />
    <path d="M22 62H33V68H22V62ZM22 74H33V80H22V74Z" fill="#050505" opacity="0.8" />
    <path d="M81 54H90V60H81V54ZM81 66H90V72H81V66ZM81 78H90V84H81V78Z" fill="#050505" opacity="0.8" />
    <path d="M8 98C36 94 92 94 120 98C94 106 34 106 8 98Z" fill="url(#forgot-blue)" />
  </svg>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugLink, setDebugLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugLink('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSuccess('If the email is registered, a password reset link has been generated.');
        if (data.data?.debug_link) {
          setDebugLink(data.data.debug_link);
        }
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Failed to reach the server.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans relative overflow-hidden items-center justify-center p-6 sm:p-10">
      {/* Visual background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0A66C2]/5 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#D4AF37 1px,transparent 1px),linear-gradient(90deg,#D4AF37 1px,transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <BGLogo className="w-10 h-10" />
          <div>
            <p className="text-white font-black tracking-widest leading-none">BG REALTY</p>
            <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest mt-0.5">Training Academy</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0b0b0d]/90 border border-[#1a1a1c] rounded-3xl p-8 sm:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          {!success ? (
            <>
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4 text-[#D4AF37]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Forgot Password?</h2>
                <p className="text-white/40 text-sm mt-1.5 font-medium leading-relaxed">
                  Enter your email address and we'll help you reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 text-sm py-3.5 px-4 rounded-xl flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-black text-white/60 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 outline-none transition-all placeholder:text-white/20 rounded-xl text-white font-medium text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#CFAE5D] via-[#D4AF37] to-[#E5C76B] hover:brightness-110 text-black rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Check Your Inbox</h2>
              <p className="text-white/50 text-sm font-medium leading-relaxed mb-6">
                If <strong className="text-white">{email}</strong> matches an account on our platform, you will receive a link to reset your password shortly.
              </p>

              {debugLink && (
                <div className="mb-6 p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-left">
                  <p className="font-black text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    Developer Sandbox Link
                  </p>
                  <p className="text-[11px] opacity-80 leading-relaxed mb-3">
                    Simulated email sent. Click the button below to proceed to the password reset form:
                  </p>
                  <a
                    href={debugLink}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C76B] text-black font-black rounded-xl transition-all text-xs shadow-md"
                  >
                    <span>Proceed to Reset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#E5C76B] font-black transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
