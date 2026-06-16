import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2 } from 'lucide-react';

/* ── Inline BGLogo (self-contained so no circular deps) ── */
const BGLogo = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="auth-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CFAE5D" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#E5C76B" />
      </linearGradient>
      <linearGradient id="auth-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A66C2" />
        <stop offset="100%" stopColor="#1E88E5" />
      </linearGradient>
    </defs>
    <path d="M15 90V55L40 40V90H15Z" fill="url(#auth-gold)" />
    <path d="M45 90V25L70 12V90H45Z" fill="url(#auth-gold)" opacity="0.95" />
    <path d="M75 90V48L95 36V90H75Z" fill="url(#auth-gold)" opacity="0.85" />
    <path d="M100 90V65L115 55V90H100Z" fill="url(#auth-gold)" opacity="0.75" />
    <path d="M52 32H63V38H52V32ZM52 46H63V52H52V46ZM52 60H63V66H52V60ZM52 74H63V80H52V74Z" fill="#050505" opacity="0.8" />
    <path d="M22 62H33V68H22V62ZM22 74H33V80H22V74Z" fill="#050505" opacity="0.8" />
    <path d="M81 54H90V60H81V54ZM81 66H90V72H81V66ZM81 78H90V84H81V78Z" fill="#050505" opacity="0.8" />
    <path d="M8 98C36 94 92 94 120 98C94 106 34 106 8 98Z" fill="url(#auth-blue)" />
  </svg>
);

/* ── Stat pill shown alongside the form ── */
const StatPill = ({ value, label }) => (
  <div className="flex flex-col items-center px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
    <span className="text-xl font-black text-[#D4AF37]">{value}</span>
    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-0.5">{label}</span>
  </div>
);

const Login = () => {
  const { login, loginWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  // Auto-login redirection if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      const redirectPath = (user.role === 'admin' || user.role === 'super_admin') && from === '/dashboard'
        ? '/admin/dashboard' : from;
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setLoading(true);
        setError('');
        const idToken = event.data.idToken;
        const result = await loginWithGoogle(idToken, remember);
        setLoading(false);
        if (result.success) {
          const redirectPath = (result.user?.role === 'admin' || result.user?.role === 'super_admin') && from === '/dashboard'
            ? '/admin/dashboard' : from;
          navigate(redirectPath, { replace: true });
        } else {
          setError(result.message);
        }
      } else if (event.data?.type === 'GOOGLE_AUTH_FAILURE') {
        setError(event.data.message || 'Google authentication failed.');
      }
    };

    window.addEventListener('message', handleMessage);

    const hash = window.location.hash.substring(1);
    const search = window.location.search.substring(1);
    const params = new URLSearchParams(hash || search);
    const idToken = params.get('id_token') || params.get('credential');
    const authError = params.get('error');

    if (idToken) {
      window.history.replaceState(null, null, window.location.pathname);
      (async () => {
        setLoading(true);
        setError('');
        const result = await loginWithGoogle(idToken, remember);
        setLoading(false);
        if (result.success) {
          const redirectPath = (result.user?.role === 'admin' || result.user?.role === 'super_admin') && from === '/dashboard'
            ? '/admin/dashboard' : from;
          navigate(redirectPath, { replace: true });
        } else {
          setError(result.message);
        }
      })();
    } else if (authError) {
      window.history.replaceState(null, null, window.location.pathname);
      setError(authError || 'Google authentication failed.');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, from, loginWithGoogle, remember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const result = await login(email, password, remember);
    setLoading(false);
    if (result.success) {
      const redirectPath = (result.user?.role === 'admin' || result.user?.role === 'super_admin') && from === '/dashboard'
        ? '/admin/dashboard' : from;
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleGoogleLogin = (e) => {
    setError(''); setInfo('');
    if (e.altKey && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      const mockToken = e.shiftKey ? 'mock-google-token-jane' : 'mock-google-token-new';
      setLoading(true);
      setTimeout(async () => {
        const result = await loginWithGoogle(mockToken, remember);
        setLoading(false);
        if (result.success) {
          const redirectPath = (result.user?.role === 'admin' || result.user?.role === 'super_admin') && from === '/dashboard'
            ? '/admin/dashboard' : from;
          navigate(redirectPath, { replace: true });
        } else { setError(result.message); }
      }, 800);
      return;
    }
    const clientId = '476678466295-8pj5ao3k65gc35grt1o31m7uk60rqvnn.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/google-callback.html';
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile&state=google_login&nonce=nonce-${Math.random().toString(36).substring(2)}`;
    
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      googleUrl,
      'GoogleLoginPopup',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans relative overflow-hidden">

      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Ambient light blobs */}
        <div className="absolute top-0 left-0 w-[60%] h-[55%] bg-[#0A66C2]/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[55%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#D4AF37 1px,transparent 1px),linear-gradient(90deg,#D4AF37 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Top logo */}
        <div className="relative z-10 flex items-center gap-3">
          <BGLogo className="w-11 h-11" />
          <div>
            <p className="text-white font-black text-base tracking-widest leading-none">BG REALTY</p>
            <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest mt-0.5">Training Academy</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Elite Real Estate Education</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Build Your{' '}
            <span className="bg-gradient-to-r from-[#CFAE5D] via-[#D4AF37] to-[#E5C76B] bg-clip-text text-transparent">
              Real Estate Empire
            </span>
            {' '}from the Ground Up
          </h1>

          <p className="text-white/50 text-base font-medium leading-relaxed mb-10">
            Access world-class underwriting models, luxury brokerage frameworks, and syndication blueprints used by top 1% real estate professionals.
          </p>

          {/* Stats row */}
          <div className="flex gap-3">
            <StatPill value="2,400+" label="Active Students" />
            <StatPill value="98%" label="Completion Rate" />
            <StatPill value="₹4.2B" label="Deals Closed" />
          </div>

          {/* Testimonial */}
          <div className="mt-10 flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80"
              alt="Student"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/40 shrink-0"
            />
            <div>
              <p className="text-white/80 text-sm font-medium leading-relaxed italic">
                "BG Realty's syndication course helped me close my first 24-unit multifamily deal within 90 days of completing the program."
              </p>
              <p className="text-[#D4AF37] text-[11px] font-black uppercase tracking-widest mt-2">Marcus B. — Multifamily Investor</p>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <p className="relative z-10 text-white/20 text-xs font-semibold">
          © 2026 BG Realty Training Academy · All rights reserved
        </p>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-10 relative">
        {/* Subtle gold glow top-right */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/6 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <BGLogo className="w-10 h-10" />
            <div>
              <p className="text-white font-black tracking-widest leading-none">BG REALTY</p>
              <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest">Training Academy</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-[#0b0b0d]/90 border border-[#1a1a1c] rounded-3xl p-8 sm:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-white/40 text-sm mt-1.5 font-medium">Sign in to continue your training journey</p>
            </div>

            {/* Error / Info */}
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-300 text-sm py-3.5 px-4 rounded-xl flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            {info && (
              <div className="mb-6 bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-blue-300 text-sm py-3.5 px-4 rounded-xl flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#0A66C2] shrink-0" />
                <span className="font-medium leading-relaxed">{info}</span>
              </div>
            )}

            {/* Google Auth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/8 text-white border border-white/10 hover:border-white/20 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-lg active:scale-[0.98] group"
            >
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm">Sign in with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-white/8"></div>
              <span className="flex-shrink mx-4 text-white/25 text-[10px] font-black uppercase tracking-widest">or sign in with email</span>
              <div className="flex-grow border-t border-white/8"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
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
                    placeholder="you@bjreality.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 outline-none transition-all placeholder:text-white/20 rounded-xl text-white font-medium text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-black text-white/60 uppercase tracking-wider block">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-[#D4AF37] hover:text-[#E5C76B] transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 outline-none transition-all placeholder:text-white/20 rounded-xl text-white font-medium text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/25 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center pt-1">
                <label className="flex items-center cursor-pointer select-none text-sm text-white/50 font-bold gap-3">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer peer-focus:ring-1 peer-focus:ring-[#D4AF37]/40 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37] relative transition-all border border-white/10" />
                  Remember my login
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#CFAE5D] via-[#D4AF37] to-[#E5C76B] hover:brightness-110 text-black rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Academy</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-white/30 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#D4AF37] hover:text-[#E5C76B] font-black transition-colors">
                Register for Courses
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
