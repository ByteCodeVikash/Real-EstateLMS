import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout as LayoutIcon, BookOpen, FileText, Video, Shield, Settings, 
  LogOut, Bell, Award, TrendingUp, Search, Flame, ChevronDown, User,
  Menu, X
} from 'lucide-react';
import { cn } from './UI';

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
  { icon: Award, label: 'Certificates', path: '/courses?nav=certificates' }, // Same page, distinct nav state for highlighting
  { icon: TrendingUp, label: 'Analytics', path: '/dashboard?nav=analytics' }, // Same page, distinct nav state for highlighting
  { icon: Shield, label: 'Security', path: '/security' },
  { icon: Settings, label: 'Settings', path: '/security?nav=settings' },
];

export const SidebarContent = ({ onItemClick }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search || '');
  const nav = searchParams.get('nav');

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
      <Link to="/" onClick={onItemClick} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 font-bold text-xs uppercase tracking-wider">
        <LogOut className="w-4.5 h-4.5" />
        <span>Exit Academy</span>
      </Link>
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
              <p className="text-xs font-black text-white group-hover:text-premium-accent transition-colors">Johnathan Doe</p>
              <p className="text-[9px] text-premium-accent uppercase font-black tracking-widest mt-0.5">Premium Student</p>
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
              <Link 
                to="/" 
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-950/20 hover:text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" /> Exit Academy
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
