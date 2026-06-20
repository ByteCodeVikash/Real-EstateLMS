import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout as LayoutIcon, BookOpen, FileText, Video, Shield, Settings, 
  LogOut, Bell, Award, TrendingUp, Search, Flame, ChevronDown, User,
  Menu, X, Sun, Moon, CreditCard
} from 'lucide-react';
import { cn } from './UI';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';


export const BGLogo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CFAE5D" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#E5C76B" />
      </linearGradient>
      <linearGradient id="bg-logo-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A66C2" />
        <stop offset="100%" stopColor="#1E88E5" />
      </linearGradient>
    </defs>
    {/* Skyline silhouette roof */}
    <path d="M15 90V55L40 40V90H15Z" fill="url(#bg-logo-gold)" />
    <path d="M45 90V25L70 12V90H45Z" fill="url(#bg-logo-gold)" opacity="0.95" />
    <path d="M75 90V48L95 36V90H75Z" fill="url(#bg-logo-gold)" opacity="0.85" />
    <path d="M100 90V65L115 55V90H100Z" fill="url(#bg-logo-gold)" opacity="0.75" />
    
    {/* Windows */}
    <path d="M52 32H63V38H52V32ZM52 46H63V52H52V46ZM52 60H63V66H52V60ZM52 74H63V80H52V74Z" fill="#08080a" opacity="0.75" />
    <path d="M22 62H33V68H22V62ZM22 74H33V80H22V74Z" fill="#08080a" opacity="0.75" />
    <path d="M81 54H90V60H81V54ZM81 66H90V72H81V66ZM81 78H90V84H81V78Z" fill="#08080a" opacity="0.75" />

    {/* Blue Swoosh Underline */}
    <path d="M8 98C36 94 92 94 120 98C94 106 34 106 8 98Z" fill="url(#bg-logo-blue)" />
    <path d="M12 102C42 99 86 99 116 102C90 109 38 109 12 102Z" fill="url(#bg-logo-blue)" opacity="0.6" />
  </svg>
);

export const BJLogo = BGLogo;

const menuItems = [
  { icon: LayoutIcon, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'My Courses', path: '/courses' },
  { icon: Video, label: 'Live Webinars', path: '/live' },
  { icon: FileText, label: 'Assignments', path: '/assignments' },
  { icon: CreditCard, label: 'My Purchases', path: '/purchases' },
  { icon: Award, label: 'Certificates', path: '/certificates' },
  { icon: TrendingUp, label: 'Analytics', path: '/dashboard?nav=analytics' }, // Same page, distinct nav state for highlighting
  { icon: Shield, label: 'Security', path: '/security' },
  { icon: Settings, label: 'Settings', path: '/security?nav=settings' },
];

export const SidebarContent = ({ onItemClick }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search || '');
  const nav = searchParams.get('nav');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    onItemClick?.();
    await logout();
    navigate('/login');
  };

  const isItemActive = (itemPath) => {
    try {
      const url = new URL(itemPath, 'https://local');
      const itemNav = url.searchParams.get('nav');
      const pathnameMatches = location.pathname === url.pathname;
      if (!pathnameMatches) return false;
      if (!itemNav) return !nav;
      return nav === itemNav;
    } catch {
      return location.pathname === itemPath;
    }
  };

  return (
    <>
    <div className="p-6 border-b border-slate-900/60 shrink-0">
      <Link to="/" onClick={onItemClick} className="flex items-center gap-3 group">
        <BGLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
        <div className="flex flex-col text-left">
          <span className="text-base font-black tracking-tight leading-none text-white group-hover:text-premium-accent transition-colors">
            BG REALTY
          </span>
          <span className="text-[9px] font-bold text-premium-accent uppercase tracking-widest mt-1">
            TRAINING ACADEMY
          </span>
        </div>
      </Link>
    </div>

    <nav className="flex-1 px-4 space-y-1 py-5 overflow-y-auto scrollbar-thin">
      {menuItems.map((item, idx) => (
        <Link
          key={idx}
          to={item.path}
          onClick={onItemClick}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer border border-transparent',
            isItemActive(item.path)
              ? 'bg-premium-accent/15 text-white border-premium-accent/20 font-bold'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
          )}
        >
          <item.icon className="w-4.5 h-4.5 group-hover:scale-115 transition-transform text-slate-400 group-hover:text-premium-accent" />
          <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
        </Link>
      ))}
    </nav>

    <div className="p-4 border-t border-slate-900 shrink-0">
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 font-bold text-xs uppercase tracking-wider text-left bg-transparent border-none cursor-pointer"
      >
        <LogOut className="w-4.5 h-4.5" />
        <span>Exit Academy</span>
      </button>
    </div>
  </>
  );
};

export const Sidebar = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-premium-dark border-r border-slate-900 hidden lg:flex flex-col z-50 shadow-xl text-slate-400">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-premium-dark border-r border-slate-900 z-[101] flex flex-col lg:hidden text-slate-400 shadow-2xl"
            >
              {/* Close Button Inside Drawer */}
              <div className="absolute top-5 right-5 z-50">
                <button
                  onClick={onClose}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent onItemClick={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const Navbar = ({ onMenuOpen }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    setProfileDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-premium-card/90 backdrop-blur-md border-b border-premium-border/80 fixed top-0 right-0 left-0 lg:left-64 z-40 px-6 sm:px-8 flex items-center justify-between shadow-lg">
      {/* Mobile Hamburger menu */}
      <button 
        onClick={onMenuOpen}
        className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-premium-border/60 text-slate-400 hover:text-premium-accent hover:border-premium-accent/30 transition-all mr-4 cursor-pointer active:scale-95 shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Bar */}
      <div className="hidden md:block flex-1 max-w-lg">
        <div className="relative group text-left">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-premium-accent transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full bg-[#08080a] border border-premium-border/60 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent transition-all font-semibold"
            placeholder="Search deals, underwriting templates, legal codes..."
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-6 ml-4 shrink-0">
        {/* Learning Streak Badge */}
        <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 sm:px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm shrink-0 text-amber-500">
          <Flame className="w-4 h-4 text-amber-500 fill-current animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider hidden xs:inline">7 Day Streak</span>
          <span className="text-[10px] font-black uppercase tracking-wider xs:hidden">7d</span>
        </div>

        {/* Notifications Icon */}
        <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-white transition-colors group shrink-0">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-premium-accent rounded-full border border-black"></span>
        </Link>

        {/* User Profile Dropdown Menu */}
        <div className="relative shrink-0">
          <button 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-6 border-l border-premium-border/60 cursor-pointer group focus:outline-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-white group-hover:text-premium-accent transition-colors">{user?.full_name || 'Student'}</p>
              <p className="text-[9px] text-premium-accent uppercase font-black tracking-widest mt-0.5">
                {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Premium Student'}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-premium-border/60 group-hover:border-premium-accent transition-all overflow-hidden shadow-sm shrink-0">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
          </button>

          {/* Profile Dropdown Items */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-12 w-52 bg-[#0b0b0d] border border-premium-border/80 rounded-xl shadow-xl p-2 z-50 text-left text-slate-400">
              <Link 
                to="/security" 
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-900/60 hover:text-white transition-all"
              >
                <User className="w-4 h-4" /> Account Details
              </Link>
              <Link 
                to="/security" 
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-900/60 hover:text-white transition-all"
              >
                <Settings className="w-4 h-4" /> Security Settings
              </Link>
              <div className="h-px bg-slate-800/80 my-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 w-full rounded-lg text-xs font-bold text-red-500 hover:bg-red-950/20 hover:text-red-400 transition-all text-left bg-transparent border-none cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Exit Academy
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/* ─── PublicNavbar ───────────────────────────────────────────────────
   Same nav as LandingPage. Used on /courses and /courses/:id.
   Links: Logo · Home · About · Courses · Contact · Theme Toggle · Login
────────────────────────────────────────────────────────────────────── */
export const PublicNavbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home',    to: '/' },
    { label: 'About',   to: '/about' },
    { label: 'Courses', to: '/courses' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className={`sticky top-0 left-0 right-0 z-50 px-8 md:px-16 py-4 backdrop-blur-xl border-b shadow-lg transition-all duration-300 ${
      isDarkMode ? 'bg-[#0A0A0C]/90 border-white/[0.04] shadow-black/40' : 'bg-white/90 border-[#E5E7EB] shadow-slate-200/50'
    }`}>
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <BGLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-500" />
          <div className="flex flex-col text-left">
            <span className={`text-base font-black tracking-tight leading-none transition-colors duration-300 ${
              isDarkMode ? 'text-white group-hover:text-[#D4AF37]' : 'text-[#111827] group-hover:text-[#D4AF37]'
            }`}>BG REALTY</span>
            <span className="text-[9px] font-bold text-[#D4AF37]/60 uppercase tracking-[0.2em] mt-0.5">Training Academy</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
            return (
              <Link
                key={idx}
                to={link.to}
                className={`px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-200 rounded-xl hover:bg-[#D4AF37]/5 ${
                  isActive
                    ? 'text-[#D4AF37]'
                    : isDarkMode
                      ? 'text-[#CFCFCF]/70 hover:text-[#D4AF37]'
                      : 'text-[#4B5563] hover:text-[#D4AF37]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`h-9 w-9 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 ${
              isDarkMode
                ? 'bg-white/[0.06] border-white/[0.12] text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30'
                : 'bg-black/[0.04] border-black/[0.1] text-[#4B5563] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to="/dashboard"
            id="nav-login-btn"
            className="hidden sm:flex h-10 px-6 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl items-center transition-all duration-300 bg-[#D4AF37] text-[#050505] border border-transparent hover:bg-[#E5C76B] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95"
          >
            Login
          </Link>

          <button
            onClick={() => setMobileOpen(v => !v)}
            className={`lg:hidden p-2 transition-colors cursor-pointer ${isDarkMode ? 'text-[#CFCFCF] hover:text-white' : 'text-[#4B5563] hover:text-black'}`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 right-0 border-b z-50 px-6 py-8 flex flex-col gap-5 lg:hidden shadow-2xl ${
              isDarkMode ? 'bg-[#0B0B0B] border-[#D4AF37]/10' : 'bg-white border-[#E5E7EB]'
            }`}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={idx}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`py-3 px-4 text-sm font-black uppercase tracking-[0.15em] transition-all rounded-xl hover:bg-[#D4AF37]/5 ${
                      isActive
                        ? 'text-[#D4AF37]'
                        : isDarkMode
                          ? 'text-[#CFCFCF]/60 hover:text-white border-b border-white/[0.02]'
                          : 'text-[#4B5563] hover:text-black border-b border-black/[0.02]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className={`pt-4 border-t flex items-center gap-4 ${isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.05]'}`}>
              <button
                onClick={toggleTheme}
                className={`h-11 px-4 flex items-center gap-2 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-white/[0.05] border-white/[0.1] text-[#CFCFCF] hover:text-[#D4AF37]'
                    : 'bg-black/[0.03] border-black/[0.08] text-[#4B5563] hover:text-[#D4AF37]'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
              <Link
                to="/dashboard"
                id="nav-login-btn-mobile"
                onClick={() => setMobileOpen(false)}
                className="flex-1 h-11 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl bg-[#D4AF37] text-[#050505] border border-transparent hover:bg-[#E5C76B] active:scale-95 flex items-center justify-center"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
