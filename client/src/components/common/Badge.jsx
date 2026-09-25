import React from 'react';

const colorStyles = {
  brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
};

export const Badge = ({ children, variant = 'slate', size = 'sm', className = '' }) => {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium',
  };

  const style = colorStyles[variant] || colorStyles.slate;

  return (
    <span
      className={`inline-flex items-center rounded-md border ${style} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
