import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0518] disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-1 transform-gpu';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white shadow-[0_6px_0_#581c87,0_10px_20px_rgba(168,85,247,0.4)] active:shadow-[0_2px_0_#581c87,0_4px_10px_rgba(168,85,247,0.3)] border border-brand-300/30 focus:ring-brand-400',
    secondary: 'bg-slate-800/90 hover:bg-slate-800 text-purple-200 border border-purple-500/30 shadow-[0_6px_0_#170e2c,0_8px_15px_rgba(0,0,0,0.4)] active:shadow-[0_2px_0_#170e2c] focus:ring-purple-400',
    outline: 'bg-slate-900/60 border-2 border-brand-400/40 hover:border-brand-400 text-purple-200 hover:text-white shadow-[0_4px_12px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(192,132,252,0.3)] focus:ring-brand-400',
    ghost: 'bg-transparent hover:bg-brand-950/60 text-purple-300 hover:text-purple-100 focus:ring-brand-400',
    danger: 'bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white shadow-[0_6px_0_#881337,0_10px_20px_rgba(225,29,72,0.3)] active:shadow-[0_2px_0_#881337] focus:ring-rose-400',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-[0_6px_0_#065f46,0_10px_20px_rgba(16,185,129,0.3)] active:shadow-[0_2px_0_#065f46] focus:ring-emerald-400',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4.5 py-2.5 text-sm font-semibold gap-2',
    lg: 'px-6 py-3 text-base font-bold gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

