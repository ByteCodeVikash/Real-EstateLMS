import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, Video, 
  ClipboardList, BarChart3, DollarSign, Award, Bell, Shield, 
  Settings, Search, Menu, X, ChevronDown, Moon, Sun, 
  Zap, LogOut, ArrowRight, UserCheck, ShieldAlert
} from 'lucide-react';
import { BJLogo } from '../Layout';
import { cn } from '../UI';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Students', path: '/admin/students' },
  { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
  { icon: GraduationCap, label: 'Instructors', path: '/admin/instructors' },
  { icon: Video, label: 'Live Classes', path: '/admin/live' },
  { icon: ClipboardList, label: 'Assignments', path: '/admin/assignments' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
  { icon: Award, label: 'Certificates', path: '/admin/certificates' },
  { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  { icon: Shield, label: 'Security', path: '/admin/security' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export const AdminSidebarContent = ({ onItemClick, isDarkMode, toggleDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Admin Logo Section */}
      <div className="p-6 border-b border-slate-900 shrink-0">
        <Link to="/admin/dashboard" onClick={onItemClick} className="flex items-center gap-3 group">
          <BJLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
          <div className="flex flex-col text-left">
            <span className="text-base font-black tracking-tight leading-none text-white group-hover:text-premium-accent transition-colors">
              BJ ADMIN
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Reality Console
            </span>
          </div>
        </Link>
      </div>

      {/* Admin Quick Banner */}
      <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live System Mode</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold border border-slate-800">
          v1.4
        </span>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-4 space-y-1 py-5 overflow-y-auto scrollbar-thin">
        {adminMenuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer border border-transparent',
              isItemActive(item.path)
                ? 'bg-gradient-to-r from-premium-accent/20 to-violet-500/10 text-white border-premium-accent/25 font-bold shadow-[0_4px_20px_rgba(37,99,235,0.1)]'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
            )}
          >
            <item.icon className={cn(
              "w-4.5 h-4.5 group-hover:scale-115 transition-transform",
              isItemActive(item.path) ? "text-premium-accent" : "text-slate-400 group-hover:text-premium-accent"
            )} />
            <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t border-slate-900 shrink-0 space-y-2">
        <Link 
          to="/dashboard" 
          onClick={onItemClick} 
          className="flex items-center justify-between px-4 py-3 w-full rounded-xl text-slate-400 bg-slate-900/50 hover:bg-slate-800/60 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-wider border border-slate-800/60"
        >
          <span className="flex items-center gap-3">
            <UserCheck className="w-4.5 h-4.5 text-premium-accent" />
            <span>Student Panel</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        
        <Link 
          to="/" 
          onClick={onItemClick} 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 font-bold text-xs uppercase tracking-wider"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Exit Console</span>
        </Link>
      </div>
    </>
  );
};

export const AdminLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('adminTheme') === 'dark' || 
      (!('adminTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Handle dark mode DOM sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adminTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adminTheme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const systemStatus = {
    latency: "14ms",
    cpu: "2%",
    status: "Healthy"
  };

  const recentNotifications = [
    { id: 1, text: "New enrollment in 'Luxury Flipping'", time: "3m ago", type: "success" },
    { id: 2, text: "Instructor Sarah submitted lesson plans", time: "25m ago", type: "info" },
    { id: 3, text: "Server resource usage high", time: "1h ago", type: "warning" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-sans transition-colors duration-300">
      
      {/* Desktop Sidebar (Fixed) */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-premium-dark border-r border-slate-900 hidden lg:flex flex-col z-50 shadow-xl text-slate-400">
        <AdminSidebarContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-premium-dark border-r border-slate-900 z-[101] flex flex-col lg:hidden text-slate-400 shadow-2xl"
            >
              <div className="absolute top-5 right-5 z-50">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AdminSidebarContent 
                onItemClick={() => setMobileSidebarOpen(false)} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-0 lg:left-64 z-40 px-6 sm:px-8 flex items-center justify-between shadow-sm transition-colors duration-300">
        {/* Left Section: Mobile Menu Trigger & System Indicator */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-premium-accent hover:border-premium-accent/30 transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* System Status Indicators */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold bg-slate-50 dark:bg-slate-850 px-3.5 py-1.5 rounded-xl border border-slate-200/65 dark:border-slate-800/80">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{systemStatus.status}</span>
            </span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800"></span>
            <span className="text-slate-400 dark:text-slate-500">DB Ping: <span className="text-premium-heading dark:text-white">{systemStatus.latency}</span></span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800"></span>
            <span className="text-slate-400 dark:text-slate-500">CPU: <span className="text-premium-heading dark:text-white">{systemStatus.cpu}</span></span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:block flex-1 max-w-sm mx-8">
          <div className="relative group text-left">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-premium-accent transition-colors" />
            <input
              type="text"
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-11 pr-4 text-xs font-bold text-premium-heading dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-premium-accent/20 focus:border-premium-accent transition-all"
              placeholder="Search console, audit logs, invoices..."
            />
          </div>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 hover:text-premium-accent dark:hover:text-premium-accent hover:border-premium-accent/20 transition-all cursor-pointer"
            title="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-500/20" /> : <Moon className="w-4.5 h-4.5 text-indigo-600 fill-indigo-500/10" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              onBlur={() => setTimeout(() => setNotificationsOpen(false), 200)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 hover:text-premium-heading dark:hover:text-white transition-all cursor-pointer relative"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-premium-accent rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
            </button>

            {/* Notifications Menu */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 text-left">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">System Alerts</span>
                  <span className="text-[9px] font-bold text-premium-accent cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="space-y-1">
                  {recentNotifications.map(n => (
                    <div key={n.id} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer flex gap-3.5">
                      <span className={cn(
                        "h-2 w-2 rounded-full mt-1.5 shrink-0",
                        n.type === "success" ? "bg-emerald-500" : n.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                      )}></span>
                      <div>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-normal">{n.text}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Avatar & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
              className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-premium-accent/40 dark:hover:border-premium-accent/40 transition-all shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </button>

            {/* Profile Dropdown Items */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2.5 z-50 text-left">
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                  <p className="text-xs font-black text-premium-heading dark:text-white">Vikash Sharma</p>
                  <p className="text-[9px] text-premium-accent uppercase font-black tracking-widest mt-0.5">Platform Owner</p>
                </div>
                <Link 
                  to="/admin/security" 
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-premium-accent transition-all"
                >
                  <ShieldAlert className="w-4 h-4 text-slate-400" /> Role & Credentials
                </Link>
                <Link 
                  to="/admin/settings" 
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-premium-accent transition-all"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> System Settings
                </Link>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5"></div>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Exit Console
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main View Area */}
      <main className="lg:pl-64 pt-28 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-112px)]">
          {children}
        </div>
      </main>

    </div>
  );
};
