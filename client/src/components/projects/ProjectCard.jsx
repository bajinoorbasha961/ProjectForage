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
    <div className="group relative glass-card-3d rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 transform-gpu">
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
            <span className="flex items-center gap-1 text-[11px] font-bold text-lavender-200 bg-brand-500/20 px-2.5 py-0.5 rounded-full border border-brand-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <Sparkles className="w-3 h-3 text-brand-300 animate-pulse" /> Hiring
            </span>
          )}
        </div>

        {/* Title & Description */}
        <Link to={`/projects/${project._id}`}>
          <h3 className="text-lg font-extrabold text-white group-hover:text-brand-300 transition-colors line-clamp-1 mb-2">
            {project.title}
          </h3>
        </Link>
        <p className="text-xs text-purple-200/80 line-clamp-2 mb-4 leading-relaxed font-normal">
          {project.shortDescription}
        </p>

        {/* Required Skills Badges */}
        <div className="mb-4">
          <p className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest mb-2">
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
        <div className="mb-4 pt-3 border-t border-purple-500/20">
          <ProgressBar progress={project.progress || 0} size="sm" />
        </div>

        {/* Footer info: Creator & Team count */}
        <div className="flex items-center justify-between pt-2 text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <img
              src={project.owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner?.name}`}
              alt={project.owner?.name}
              className="w-6 h-6 rounded-full bg-purple-950 object-cover border border-purple-400/40"
            />
            <span className="truncate max-w-[100px] text-purple-200 font-semibold">
              {project.owner?.name || 'Student'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 font-semibold text-purple-200">
              <Users className="w-3.5 h-3.5 text-brand-300" />
              <span>
                {memberCount}/{project.teamSize || 4}
              </span>
            </div>

            <Link
              to={`/projects/${project._id}`}
              className="inline-flex items-center gap-1 font-bold text-brand-300 hover:text-white transition-colors group-hover:translate-x-0.5"
            >
              Details <ArrowRight className="w-3.5 h-3.5 text-brand-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

