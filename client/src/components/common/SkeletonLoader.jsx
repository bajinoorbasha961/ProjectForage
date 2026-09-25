import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse space-y-4">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-slate-800 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-800 rounded w-3/4"></div>
        <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-800/80 rounded w-full"></div>
      <div className="h-3 bg-slate-800/80 rounded w-5/6"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-slate-800 rounded-md"></div>
      <div className="h-6 w-20 bg-slate-800 rounded-md"></div>
    </div>
  </div>
);

export const ListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 w-1/2">
          <div className="w-8 h-8 rounded-full bg-slate-800"></div>
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
        </div>
        <div className="h-4 bg-slate-800 rounded w-20"></div>
      </div>
    ))}
  </div>
);
