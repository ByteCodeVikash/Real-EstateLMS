import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────
export const Button = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
  const variants = {
    primary:  'bg-gradient-premium text-black hover:brightness-110 hover:shadow-gold-md font-black',
    gold:     'bg-gradient-premium text-black hover:brightness-110 hover:shadow-gold-md font-black',
    blue:     'bg-gradient-violet text-white hover:brightness-110 hover:shadow-blue-md font-black',
    secondary:'bg-[#111114] text-slate-300 hover:bg-[#16161a] border border-[#1a1a1c] hover:border-[#2a2a2e]',
    outline:  'border border-[#1e1e22] bg-[#0e0e11] text-slate-300 hover:bg-[#111114] hover:text-white hover:border-premium-accent/30 font-bold',
    ghost:    'text-slate-400 hover:text-white hover:bg-white/5',
    danger:   'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 hover:text-red-300',
  };

  const sizes = {
    sm:   'px-4 py-2 text-xs rounded-xl',
    md:   'px-5 py-2.5 text-sm rounded-xl',
    lg:   'px-8 py-4 text-base rounded-2xl',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────
export const Badge = ({ className, variant = 'info', children }) => {
  const variants = {
    info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger:  'bg-red-500/10 text-red-400 border-red-500/20',
    premium: 'bg-premium-accent/10 text-premium-accent border-premium-accent/20',
    blue:    'bg-[#0A66C2]/10 text-[#1E88E5] border-[#0A66C2]/20',
    muted:   'bg-white/5 text-slate-400 border-white/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border tracking-widest uppercase',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

// ─────────────────────────────────────────────────────────
// GlassCard  — dark by default
// ─────────────────────────────────────────────────────────
export const GlassCard = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-[#0b0b0d] border border-[#1a1a1c] rounded-2xl transition-all duration-300',
        'hover:border-premium-accent/15 shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Stat Card  — dark luxury version
// ─────────────────────────────────────────────────────────
export const StatCard = ({ title, value, detail, icon: Icon, accentClass = 'text-premium-accent', bgClass = 'bg-premium-accent/10', borderClass = 'border-premium-accent/15' }) => {
  return (
    <div className={cn('stat-card-dark relative overflow-hidden group', borderClass)}>
      {/* subtle corner glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-premium-accent/5 blur-2xl group-hover:bg-premium-accent/10 transition-all duration-500" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{title}</span>
          <div className={cn('p-2 rounded-xl border border-white/5', bgClass)}>
            {Icon && <Icon className={cn('w-4 h-4', accentClass)} />}
          </div>
        </div>
        <p className="text-2xl font-black text-white mb-1">{value}</p>
        {detail && <p className="text-[10px] text-slate-500 font-bold">{detail}</p>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────
export const Divider = ({ className }) => (
  <div className={cn('h-px bg-[#1a1a1c]', className)} />
);

// ─────────────────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────────────────
export const Skeleton = ({ className }) => (
  <div className={cn('bg-[#111114] rounded-xl overflow-hidden relative', className)}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
  </div>
);
