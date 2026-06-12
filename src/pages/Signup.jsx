import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Star } from 'lucide-react';

const BGLogo = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="su-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CFAE5D" /><stop offset="50%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#E5C76B" />
      </linearGradient>
      <linearGradient id="su-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A66C2" /><stop offset="100%" stopColor="#1E88E5" />
      </linearGradient>
    </defs>
    <path d="M15 90V55L40 40V90H15Z" fill="url(#su-gold)" />
    <path d="M45 90V25L70 12V90H45Z" fill="url(#su-gold)" opacity="0.95" />
    <path d="M75 90V48L95 36V90H75Z" fill="url(#su-gold)" opacity="0.85" />
    <path d="M100 90V65L115 55V90H100Z" fill="url(#su-gold)" opacity="0.75" />
    <path d="M52 32H63V38H52V32ZM52 46H63V52H52V46ZM52 60H63V66H52V60ZM52 74H63V80H52V74Z" fill="#050505" opacity="0.8" />
    <path d="M22 62H33V68H22V62ZM22 74H33V80H22V74Z" fill="#050505" opacity="0.8" />
    <path d="M81 54H90V60H81V54ZM81 66H90V72H81V66ZM81 78H90V84H81V78Z" fill="#050505" opacity="0.8" />
    <path d="M8 98C36 94 92 94 120 98C94 106 34 106 8 98Z" fill="url(#su-blue)" />
  </svg>
);

const Benefit = ({ text }) => (
  <li className="flex items-start gap-3">
    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
      <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
    </div>
    <span className="text-white/60 text-sm font-medium">{text}</span>
  </li>
);

const IC = "w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 outline-none transition-all placeholder:text-white/20 rounded-xl text-white font-medium text-sm";

const Signup = () => {
  const { signup, loginWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-login redirection if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setLoading(true);
        setError('');
        const idToken = event.data.idToken;
        const result = await loginWithGoogle(idToken, false);
        setLoading(false);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.message);
        }
      } else if (event.data?.type === 'GOOGLE_AUTH_FAILURE') {
        setError(event.data.message || 'Google signup failed.');
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
        setLoading(true); setError('');
        const result = await loginWithGoogle(idToken, false);
        setLoading(false);
        if (result.success) { navigate('/dashboard'); } else { setError(result.message); }
      })();
    } else if (authError) {
      window.history.replaceState(null, null, window.location.pathname);
      setError(authError || 'Google signup failed.');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, loginWithGoogle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setInfo('');
    if (!fullName || !email || !password || !confirmPassword) { setError('Please fill in all required fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const result = await signup(fullName, email, phone, password, confirmPassword);
    setLoading(false);
    if (result.success) {
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } else { setError(result.message); }
  };

  const handleGoogleSignup = (e) => {
    setError(''); setInfo('');
    if (e.altKey && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      const mockToken = e.shiftKey ? 'mock-google-token-jane' : 'mock-google-token-new';
      setLoading(true);
      setTimeout(async () => {
        const result = await loginWithGoogle(mockToken, false);
        setLoading(false);
        if (result.success) { navigate('/dashboard'); } else { setError(result.message); }
      }, 800);
      return;
    }
    const clientId = '476678466295-8pj5ao3k65gc35grt1o31m7uk60rqvnn.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/google-callback.html';
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile&state=google_signup&nonce=nonce-${Math.random().toString(36).substring(2)}`;
    
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      googleUrl,
      'GoogleSignupPopup',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans relative overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[40%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-[70%] h-[60%] bg-[#0A66C2]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[60%] h-[55%] bg-[#D4AF37]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#D4AF37 1px,transparent 1px),linear-gradient(90deg,#D4AF37 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex items-center gap-3">
          <BGLogo className="w-11 h-11" />
          <div>
            <p className="text-white font-black text-base tracking-widest leading-none">BG REALTY</p>
            <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest mt-0.5">Training Academy</p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-5">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-current" />)}
            <span className="text-white/40 text-xs font-bold ml-2">4.9 / 5 · 2,400+ students</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight mb-4">
            Join the Academy.<br />
            <span className="bg-gradient-to-r from-[#CFAE5D] via-[#D4AF37] to-[#E5C76B] bg-clip-text text-transparent">Dominate the Market.</span>
          </h1>
          <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">Get unlimited access to premium courses, live webinars, underwriting templates, and a private investor network.</p>
          <ul className="space-y-4">
            <Benefit text="10+ premium courses on luxury brokerage, underwriting & syndication" />
            <Benefit text="Live market analysis webinars every week with active investors" />
            <Benefit text="Downloadable CMA reports, deal models, and LOI templates" />
            <Benefit text="Completion certificates recognized by top brokerages nationwide" />
            <Benefit text="Private community of 2,400+ real estate professionals" />
          </ul>
        </div>
        <p className="relative z-10 text-white/20 text-xs font-semibold">© 2026 BG Realty Training Academy · All rights reserved</p>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-lg relative z-10 py-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <BGLogo className="w-10 h-10" />
            <div>
              <p className="text-white font-black tracking-widest leading-none">BG REALTY</p>
              <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest">Training Academy</p>
            </div>
          </div>

          <div className="bg-[#0b0b0d]/90 border border-[#1a1a1c] rounded-3xl p-8 sm:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Your Account</h2>
              <p className="text-white/40 text-sm mt-1.5 font-medium">Join the premium real estate training academy</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 text-sm py-3.5 px-4 rounded-xl flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" /><span className="font-medium">{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm py-3.5 px-4 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" /><span className="font-medium">{success}</span>
              </div>
            )}

            {/* Google */}
            <button type="button" onClick={handleGoogleSignup} className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/8 text-white border border-white/10 hover:border-white/20 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-lg active:scale-[0.98] group">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm">Register with Google</span>
            </button>

            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-white/8"></div>
              <span className="flex-shrink mx-4 text-white/25 text-[10px] font-black uppercase tracking-widest">or sign up with email</span>
              <div className="flex-grow border-t border-white/8"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-xs font-black text-white/60 uppercase tracking-wider block">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25"><User className="w-4 h-4" /></div>
                    <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className={IC} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-black text-white/60 uppercase tracking-wider block">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25"><Phone className="w-4 h-4" /></div>
                    <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" className={IC} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-black text-white/60 uppercase tracking-wider block">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25"><Mail className="w-4 h-4" /></div>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className={IC} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs font-black text-white/60 uppercase tracking-wider block">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25"><Lock className="w-4 h-4" /></div>
                    <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 chars" className={IC + " pr-12"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/25 hover:text-white/60 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-xs font-black text-white/60 uppercase tracking-wider block">Confirm *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25"><Lock className="w-4 h-4" /></div>
                    <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter" className={IC + " pr-12"} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/25 hover:text-white/60 transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading || !!success} className="w-full py-3.5 bg-gradient-to-r from-[#CFAE5D] via-[#D4AF37] to-[#E5C76B] hover:brightness-110 text-black rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><span>Enroll Now — It's Free</span><ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-white/30 font-medium">
              Already enrolled?{' '}
              <Link to="/login" className="text-[#D4AF37] hover:text-[#E5C76B] font-black transition-colors">Sign In Instead</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
