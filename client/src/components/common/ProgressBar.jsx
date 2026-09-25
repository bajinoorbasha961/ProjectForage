import React from 'react';

export const ProgressBar = ({ progress = 0, size = 'md', showLabel = true, className = '' }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getColor = (pct) => {
    if (pct < 30) return 'from-amber-500 to-amber-400';
    if (pct < 75) return 'from-brand-600 to-brand-400';
    return 'from-emerald-500 to-emerald-400';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-400">
          <span>Progress</span>
          <span className="text-slate-200 font-semibold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${getColor(percentage)} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
