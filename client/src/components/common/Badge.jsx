import React from 'react';

const colorStyles = {
  brand: 'bg-brand-500/20 text-brand-200 border-brand-400/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
  rose: 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
  purple: 'bg-lavender-500/20 text-lavender-200 border-lavender-400/40 shadow-[0_0_10px_rgba(196,139,255,0.25)]',
  indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]',
  slate: 'bg-[#1e1338]/80 text-purple-200 border-purple-500/30',
};

export const Badge = ({ children, variant = 'slate', size = 'sm', className = '' }) => {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[11px] font-semibold',
    sm: 'px-2.5 py-1 text-xs font-bold',
    md: 'px-3 py-1.5 text-sm font-bold',
  };

  const style = colorStyles[variant] || colorStyles.slate;

  return (
    <span
      className={`inline-flex items-center rounded-xl border backdrop-blur-md transition-all ${style} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

