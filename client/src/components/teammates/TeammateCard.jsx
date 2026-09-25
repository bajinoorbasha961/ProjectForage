import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Calendar, Mail, ExternalLink, UserPlus } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MatchScoreBadge } from './MatchScoreBadge';

export const TeammateCard = ({ student, matchScore, onInviteClick }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div>
        {/* Header: Avatar, Name & Match Score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
              alt={student.name}
              className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700 shadow-md"
            />
            <div>
              <Link to={`/users/${student._id}`}>
                <h3 className="text-base font-bold text-white hover:text-brand-400 transition-colors">
                  {student.name}
                </h3>
              </Link>
              <p className="text-xs text-brand-400 font-medium flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5" />
                {student.college || 'University'}
              </p>
            </div>
          </div>

          {matchScore !== undefined && <MatchScoreBadge score={matchScore} />}
        </div>

        {/* Dept & Year */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            {student.department || 'Computer Science'}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {student.year || '3rd Year'}
          </span>
        </div>

        {/* Bio */}
        {student.bio && (
          <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed italic">
            "{student.bio}"
          </p>
        )}

        {/* Skills */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Top Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {student.skills?.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="brand" size="xs">
                {skill}
              </Badge>
            ))}
            {student.skills?.length > 5 && (
              <Badge variant="slate" size="xs">
                +{student.skills.length - 5}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <Link to={`/users/${student._id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
        {onInviteClick && (
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => onInviteClick(student)}
          >
            Invite
          </Button>
        )}
      </div>
    </div>
  );
};
