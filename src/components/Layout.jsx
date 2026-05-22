import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout as LayoutIcon, BookOpen, FileText, Video, Shield, Settings, 
  LogOut, Bell, Award, TrendingUp, Search, Flame, ChevronDown, User,
  Menu, X
} from 'lucide-react';
import { cn } from './UI';

export const BJLogo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Cap Diamond top representing education */}
    <path d="M64 12L116 36L64 60L12 36L64 12Z" fill="url(#logo-blue)" />
    {/* Cap tassel hanging down in premium gold */}
    <path d="M116 36V70C116 74 112 78 108 78" stroke="url(#logo-gold)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="108" cy="78" r="4" fill="url(#logo-gold)" />
    
    {/* Building Pillars forming 'B' and 'J' initials */}
    <rect x="36" y="58" width="12" height="52" rx="3.5" fill="url(#logo-blue)" />
    <path d="M48 58H68C75.5 58 79.5 62 79.5 67.5C79.5 73 75.5 77 68 77H48V58Z" fill="url(#logo-blue)" opacity="0.9" />
    <path d="M48 77H71C79 77 83 81.5 83 87.5C83 93.5 79 98 71 98H42C38.5 98 36 95.5 36 92" fill="url(#logo-blue)" />
    <path d="M96 58V90C96 98 90 104 82 104C74 104 68 98 68 90" stroke="url(#logo-gold)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
    <div className="p-6 border-b border-slate-900 shrink-0">
      <Link to="/" onClick={onItemClick} className="flex items-center gap-3 group">
        <BJLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
        <div className="flex flex-col text-left">
          <span className="text-base font-black tracking-tight leading-none text-white group-hover:text-premium-accent transition-colors">
            BJ REALITY
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Training Courses
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
    <header className="h-20 bg-white/95 backdrop-blur-md border-b border-premium-border fixed top-0 right-0 left-0 lg:left-64 z-40 px-6 sm:px-8 flex items-center justify-between shadow-sm">
      {/* Mobile Hamburger menu */}
      <button 
        onClick={onMenuOpen}
        className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 border border-premium-border text-slate-500 hover:text-premium-accent hover:border-premium-accent/30 transition-all mr-4 cursor-pointer active:scale-95 shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Bar */}
      <div className="hidden md:block flex-1 max-w-lg">
        <div className="relative group text-left">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-premium-accent transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full bg-slate-50 border border-premium-border rounded-xl py-2.5 pl-11 pr-4 text-xs text-premium-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent transition-all font-semibold"
            placeholder="Search deals, underwriting templates, legal codes..."
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-6 ml-4 shrink-0">
        {/* Learning Streak Badge */}
        <div className="bg-amber-50 border border-amber-100 px-2.5 sm:px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm shrink-0">
          <Flame className="w-4 h-4 text-amber-500 fill-current animate-pulse" />
          <span className="text-[10px] text-amber-700 font-black uppercase tracking-wider hidden xs:inline">7 Day Streak</span>
          <span className="text-[10px] text-amber-700 font-black uppercase tracking-wider xs:hidden">7d</span>
        </div>

        {/* Notifications Icon */}
        <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-premium-heading transition-colors group shrink-0">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-premium-accent rounded-full border border-white"></span>
        </Link>

        {/* User Profile Dropdown Menu */}
        <div className="relative shrink-0">
          <button 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-6 border-l border-premium-border cursor-pointer group focus:outline-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-premium-heading group-hover:text-premium-accent transition-colors">Johnathan Doe</p>
              <p className="text-[9px] text-premium-accent uppercase font-black tracking-widest mt-0.5">Premium Student</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-premium-border group-hover:border-premium-accent transition-all overflow-hidden shadow-sm shrink-0">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-premium-heading transition-colors shrink-0" />
          </button>

          {/* Profile Dropdown Items */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-12 w-52 bg-white border border-premium-border rounded-xl shadow-xl p-2 z-50 text-left">
              <Link 
                to="/security" 
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-premium-accent transition-all"
              >
                <User className="w-4 h-4" /> Account Details
              </Link>
              <Link 
                to="/security" 
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-premium-accent transition-all"
              >
                <Settings className="w-4 h-4" /> Security Settings
              </Link>
              <div className="h-px bg-slate-100 my-1"></div>
              <Link 
                to="/" 
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
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
