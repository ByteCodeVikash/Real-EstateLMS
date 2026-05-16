import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
  const variants = {
    primary: 'bg-gradient-premium text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]',
    secondary: 'bg-premium-border text-white hover:bg-premium-border/80',
    outline: 'border border-premium-border text-white hover:bg-premium-border/50',
    ghost: 'text-premium-text hover:text-white hover:bg-premium-border/30',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
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
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    premium: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  );
};

export const GlassCard = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'glass-premium rounded-2xl p-6 transition-all duration-300 hover:border-premium-border/80 hover:shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
