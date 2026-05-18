import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
  const variants = {
    primary: 'bg-gradient-premium text-white hover:shadow-[0_8px_25px_rgba(37,99,235,0.25)]',
    gold: 'bg-gradient-violet text-white hover:shadow-[0_8px_25px_rgba(124,58,237,0.25)] font-bold',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border border-premium-border bg-white text-slate-700 hover:bg-slate-50 hover:text-premium-heading hover:border-premium-accent/30',
    ghost: 'text-premium-text hover:text-premium-heading hover:bg-slate-100/80',
    danger: 'bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 shadow-sm',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
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

export const Badge = ({ className, variant = 'info', children }) => {
  const variants = {
    info: 'bg-blue-50 text-blue-600 border-blue-100/60',
    success: 'bg-green-50 text-green-600 border-green-100/60',
    warning: 'bg-amber-50 text-amber-600 border-amber-100/60',
    danger: 'bg-red-50 text-red-600 border-red-100/60',
    premium: 'bg-violet-50 text-violet-600 border-violet-100/60',
  };

  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-black border tracking-wide uppercase', variants[variant], className)}>
      {children}
    </span>
  );
};

export const GlassCard = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'glass-premium rounded-2xl p-6 transition-all duration-300 hover:border-premium-accent/20 hover:shadow-[0_12px_45px_rgba(15,23,42,0.06)] border border-premium-border/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
