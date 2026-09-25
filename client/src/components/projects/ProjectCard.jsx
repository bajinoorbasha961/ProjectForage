import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const ProjectCard = ({ project }) => {
  const getDifficultyVariant = (diff) => {
    switch (diff) {
      case 'Beginner':
        return 'emerald';
      case 'Intermediate':
        return 'brand';
      case 'Advanced':
        return 'purple';
      default:
        return 'slate';
    }
  };

  const getCategoryVariant = (cat) => {
    switch (cat) {
      case 'Web Development':
        return 'brand';
      case 'AI/ML':
        return 'purple';
      case 'Mobile Development':
        return 'emerald';
      case 'Blockchain':
        return 'amber';
      case 'IoT':
        return 'indigo';
      default:
        return 'slate';
    }
  };

  const memberCount = project.currentMemberCount || (project.members ? project.members.length : 1);

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-brand-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={getCategoryVariant(project.category)} size="xs">
              {project.category}
            </Badge>
            <Badge variant={getDifficultyVariant(project.difficulty)} size="xs">
              {project.difficulty}
            </Badge>
          </div>
          {project.lookingForTeammates && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> Hiring
            </span>
          )}
        </div>

        {/* Title & Description */}
        <Link to={`/projects/${project._id}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1 mb-2">
            {project.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Required Skills Badges */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.requiredSkills?.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="slate" size="xs">
                {skill}
              </Badge>
            ))}
            {project.requiredSkills?.length > 4 && (
              <Badge variant="slate" size="xs">
                +{project.requiredSkills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div>
        {/* Progress Bar */}
        <div className="mb-4 pt-3 border-t border-slate-800/80">
          <ProgressBar progress={project.progress || 0} size="sm" />
        </div>

        {/* Footer info: Creator & Team count */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <img
              src={project.owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner?.name}`}
              alt={project.owner?.name}
              className="w-6 h-6 rounded-full bg-slate-800 object-cover"
            />
            <span className="truncate max-w-[100px] text-slate-300 font-medium">
              {project.owner?.name || 'Student'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 font-medium text-slate-300">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {memberCount}/{project.teamSize || 4}
              </span>
            </div>

            <Link
              to={`/projects/${project._id}`}
              className="inline-flex items-center gap-1 font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
