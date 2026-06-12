import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';

const BGLogo = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="al-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CFAE5D" /><stop offset="50%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#E5C76B" />
      </linearGradient>
      <linearGradient id="al-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A66C2" /><stop offset="100%" stopColor="#1E88E5" />
      </linearGradient>
    </defs>
    <path d="M15 90V55L40 40V90H15Z" fill="url(#al-gold)" />
    <path d="M45 90V25L70 12V90H45Z" fill="url(#al-gold)" opacity="0.95" />
    <path d="M75 90V48L95 36V90H75Z" fill="url(#al-gold)" opacity="0.85" />
    <path d="M100 90V65L115 55V90H100Z" fill="url(#al-gold)" opacity="0.75" />
    <path d="M52 32H63V38H52V32ZM52 46H63V52H52V46ZM52 60H63V66H52V60ZM52 74H63V80H52V74Z" fill="#050505" opacity="0.8" />
    <path d="M22 62H33V68H22V62ZM22 74H33V80H22V74Z" fill="#050505" opacity="0.8" />
    <path d="M81 54H90V60H81V54ZM81 66H90V72H81V66ZM81 78H90V84H81V78Z" fill="#050505" opacity="0.8" />
    <path d="M8 98C36 94 92 94 120 98C94 106 34 106 8 98Z" fill="url(#al-blue)" />
  </svg>
);

const IC = "w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-[#0A66C2]/60 focus:ring-1 focus:ring-[#0A66C2]/30 outline-none transition-all placeholder:text-white/20 rounded-xl text-white font-medium text-sm";

const AdminLogin = () => {
  const { login, logout, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-login redirection if administrator is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const result = await login(email, password, false);
    setLoading(false);
    if (result.success) {
      if (result.user.role === 'admin' || result.user.role === 'super_admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        await logout();
        setError('Access Denied. You do not have administrative permissions.');
      }
    } else {
      setError(result.message || 'Authentication failed. Verify your credentials.');
    }
  };

  const fillCredentials = (role) => {
    if (role === 'super') { setEmail('superadmin@bjreality.com'); setPassword('password123'); }
    else if (role === 'admin') { setEmail('admin@bjreality.com'); setPassword('password123'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Ambient blobs - blue accent for admin portal */}
      <div className="absolute top-[-20%] left-[-20%] w-[55%] h-[55%] bg-[#0A66C2]/12 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[55%] h-[55%] bg-[#D4AF37]/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[45%] w-[30%] h-[30%] bg-[#0A66C2]/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#D4AF37 1px,transparent 1px),linear-gradient(90deg,#D4AF37 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-[#0b0b0d]/95 border border-[#1a1a1c] rounded-3xl p-8 sm:p-10 shadow-[0_40px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            {/* Shield icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 mb-5">
              <ShieldCheck className="w-9 h-9 text-[#1E88E5]" />
            </div>
            <BGLogo className="w-14 h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-black text-white tracking-widest uppercase">BG Admin</h1>
            <span className="text-[9px] block text-[#D4AF37] uppercase tracking-widest font-black mt-1">Realty LMS — Secure Console</span>
            <p className="text-white/40 text-sm mt-3 font-medium">Verify credentials to access the administrative gateway</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/100/10 border border-red-500/20 text-red-300 text-sm py-3.5 px-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-white/50 uppercase tracking-wider block">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25"><Mail className="w-4.5 h-4.5" /></div>
                <input
                  id="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bgrealtyacademy.com"
                  className={IC}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-black text-white/50 uppercase tracking-wider block">Secure Token / Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/25"><Lock className="w-4.5 h-4.5" /></div>
                <input
                  id="password" type={showPassword ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={IC + " pr-12"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/25 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#0A66C2] to-[#1E88E5] hover:brightness-110 text-white rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(10,102,194,0.25)] hover:shadow-[0_8px_30px_rgba(10,102,194,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><span>Unlock Console</span><ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Developer sandbox */}
          <div className="mt-8 border-t border-white/8 pt-6">
            <span className="text-[10px] uppercase font-black text-white/30 tracking-wider block mb-3">Developer Sandbox Presets</span>
            <div className="flex gap-2">
              <button
                onClick={() => fillCredentials('super')}
                className="flex-1 py-2 px-3 bg-white/5 border border-white/10 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/20 text-white/60 hover:text-[#D4AF37] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </button>
              <button
                onClick={() => fillCredentials('admin')}
                className="flex-1 py-2 px-3 bg-white/5 border border-white/10 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/20 text-white/60 hover:text-[#1E88E5] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Standard Admin</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-white/25 font-medium">
            Need student portal?{' '}
            <Link to="/login" className="text-[#D4AF37] hover:text-[#E5C76B] font-black transition-colors">Student Sign In</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
