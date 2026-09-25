import React from 'react';
import { Search, Filter, X, Sparkles } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Development',
  'AI/ML',
  'Data Science',
  'Cybersecurity',
  'IoT',
  'Blockchain',
  'Cloud',
  'Game Development',
  'UI/UX',
  'Other',
];

export const ProjectFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  status,
  setStatus,
  lookingForTeammates,
  setLookingForTeammates,
  onReset,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, description, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Select */}
        <div className="w-full md:w-48">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Select */}
        <div className="w-full md:w-40">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Status Select */}
        <div className="w-full md:w-40">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={lookingForTeammates}
            onChange={(e) => setLookingForTeammates(e.target.checked)}
            className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-brand-500 focus:ring-brand-500"
          />
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Only show projects looking for teammates</span>
        </label>

        {(search || category !== 'All' || difficulty !== 'All' || status !== 'All' || lookingForTeammates) && (
          <button
            onClick={onReset}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
