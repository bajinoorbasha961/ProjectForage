import React from 'react';

export const ProgressBar = ({ progress = 0, size = 'md', showLabel = true, className = '' }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4.5',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-purple-300">
          <span>Project Progress</span>
          <span className="text-white font-extrabold text-lavender-glow">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-[#120a24] border border-purple-500/20 rounded-full overflow-hidden p-0.5 shadow-inner ${heights[size]}`}>
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-lavender-300 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.6)] relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

