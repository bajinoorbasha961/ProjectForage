import React from 'react';
import { Sparkles } from 'lucide-react';

export const MatchScoreBadge = ({ score = 0 }) => {
  const getScoreColor = (s) => {
    if (s >= 75) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s >= 40) return 'bg-brand-500/10 text-brand-400 border-brand-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(
        score
      )} shadow-sm`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      {score}% Skill Match
    </span>
  );
};
