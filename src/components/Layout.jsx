import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layout as LayoutIcon, BookOpen, FileText, Video, BarChart3, Shield, Settings, LogOut, Award, Bell } from 'lucide-react';
import { cn } from './UI';

const menuItems = [
  { icon: LayoutIcon, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'My Courses', path: '/courses' },
  { icon: FileText, label: 'Assignments', path: '/assignments' },
  { icon: Video, label: 'Live Classes', path: '/live' },
  { icon: BarChart3, label: 'Market Insights', path: '/analytics' },
  { icon: Award, label: 'Accreditations', path: '/certificates' },
  { icon: Shield, label: 'Security', path: '/security' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-premium border-r border-premium-border/50 hidden lg:flex flex-col z-50">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg shadow-premium-accent/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-premium-text">
            Real-EstateLMS
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                isActive
                  ? 'bg-premium-accent/10 text-premium-accent shadow-sm'
                  : 'text-premium-text hover:bg-premium-border/30 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-premium-border/50">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-premium-text hover:bg-red-500/10 hover:text-red-400 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const Navbar = () => {
  return (
    <header className="h-20 glass-premium border-b border-premium-border/50 fixed top-0 right-0 left-0 lg:left-64 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-premium-text group-focus-within:text-premium-accent transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full bg-premium-dark/50 border border-premium-border/50 rounded-xl py-2 pl-10 pr-4 text-white placeholder-premium-text focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent transition-all"
            placeholder="Search market reports, valuation models, legal docs..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-premium-text hover:text-white transition-colors group">
          <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-premium-accent rounded-full border-2 border-premium-card"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-premium-border/50 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white group-hover:text-premium-accent transition-colors">John Doe</p>
            <p className="text-xs text-premium-text">Pro Student</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-premium-border group-hover:border-premium-accent transition-all overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
