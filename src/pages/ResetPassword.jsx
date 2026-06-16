import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

const BGLogo = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="reset-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CFAE5D" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#E5C76B" />
      </linearGradient>
      <linearGradient id="reset-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A66C2" />
        <stop offset="100%" stopColor="#1E88E5" />
      </linearGradient>
    </defs>
    <path d="M15 90V55L40 40V90H15Z" fill="url(#reset-gold)" />
    <path d="M45 90V25L70 12V90H45Z" fill="url(#reset-gold)" opacity="0.95" />
    <path d="M75 90V48L95 36V90H75Z" fill="url(#reset-gold)" opacity="0.85" />
    <path d="M100 90V65L115 55V90H100Z" fill="url(#reset-gold)" opacity="0.75" />
    <path d="M52 32H63V38H52V32ZM52 46H63V52H52V46ZM52 60H63V66H52V60ZM52 74H63V80H52V74Z" fill="#050505" opacity="0.8" />
    <path d="M22 62H33V68H22V62ZM22 74H33V80H22V74Z" fill="#050505" opacity="0.8" />
    <path d="M81 54H90V60H81V54ZM81 66H90V72H81V66ZM81 78H90V84H81V78Z" fill="#050505" opacity="0.8" />
    <path d="M8 98C36 94 92 94 120 98C94 106 34 106 8 98Z" fill="url(#reset-blue)" />
  </svg>
);

const IC = "w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 outline-none transition-all placeholder:text-white/20 rounded-xl text-white font-medium text-sm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [validationState, setValidationState] = useState('loading'); // 'loading' | 'valid' | 'invalid'
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setValidationState('invalid');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/reset-password/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setEmail(data.data.email);
          setFullName(data.data.full_name);
          setValidationState('valid');
        } else {
          setValidationState('invalid');
        }
      } catch (err) {
        setValidationState('invalid');
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
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
          {validationState === 'loading' && (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/40 text-sm font-semibold">Validating secure token...</p>
            </div>
          )}

          {validationState === 'invalid' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Invalid or Expired Link</h2>
              <p className="text-white/50 text-sm font-medium leading-relaxed mb-6">
                This password reset link is invalid, has expired, or has already been used. Please request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="w-full py-3.5 bg-gradient-to-r from-[#CFAE5D] via-[#D4AF37] to-[#E5C76B] hover:brightness-110 text-black rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-all"
              >
                <span>Request New Reset Link</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {validationState === 'valid' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Reset Password</h2>
                <p className="text-white/40 text-sm mt-1.5 font-medium leading-relaxed">
                  Resetting password for <strong className="text-white/60">{email}</strong>
                </p>
              </div>

              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 text-sm py-3.5 px-4 rounded-xl flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm py-3.5 px-4 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
                  <span className="font-medium">{success}</span>
                </div>
              )}

              {!success && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-xs font-black text-white/60 uppercase tracking-wider block">New Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        className={IC}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/25 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-xs font-black text-white/60 uppercase tracking-wider block">Confirm Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter"
                        className={IC}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/25 hover:text-white/60 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#CFAE5D] via-[#D4AF37] to-[#E5C76B] hover:brightness-110 text-black rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
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

export default ResetPassword;
