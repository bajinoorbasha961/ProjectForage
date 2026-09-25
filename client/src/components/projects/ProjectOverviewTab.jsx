import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import {
  Github,
  Globe,
  Users,
  Calendar,
  Layers,
  Sparkles,
  UserCheck,
  Send,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '../../services/projectService';

export const ProjectOverviewTab = ({ project, isMember, onJoinSuccess }) => {
  const [joinMessage, setJoinMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleSendJoinRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await projectService.joinProject(project._id, joinMessage);
      if (res.success) {
        toast.success('Join request sent successfully to project owner! 🎉');
        setShowJoinModal(false);
        setJoinMessage('');
        if (onJoinSuccess) onJoinSuccess();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send join request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner / Header Summary */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">{project.category}</Badge>
              <Badge variant="purple">{project.difficulty}</Badge>
              <Badge variant={project.status === 'Completed' ? 'emerald' : 'amber'}>
                {project.status}
              </Badge>
              {project.lookingForTeammates && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Seeking Teammates
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {project.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">{project.shortDescription}</p>

            {/* Links */}
            <div className="flex flex-wrap gap-4 pt-2">
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub Repository
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Globe className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Join Project Action */}
          <div className="w-full md:w-auto bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center min-w-[240px]">
            <div className="text-xs text-slate-400 mb-1">Team Capacity</div>
            <div className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-1.5">
              <Users className="w-5 h-5 text-brand-400" />
              <span>{project.stats?.currentMemberCount || 1} / {project.teamSize || 4} Members</span>
            </div>

            {isMember ? (
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 py-2.5 px-4 rounded-xl border border-emerald-500/20">
                <UserCheck className="w-4 h-4" /> You are on the team
              </div>
            ) : project.lookingForTeammates ? (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setShowJoinModal(true)}
              >
                Request to Join Team
              </Button>
            ) : (
              <div className="text-xs text-slate-500 py-2 font-medium">Team Is Full</div>
            )}
          </div>
        </div>

        {/* Progress bar in overview */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <ProgressBar progress={project.stats?.progress || 0} size="md" showLabel={true} />
        </div>
      </div>

      {/* Detailed Description & Required Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">About the Project</h3>
            <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {project.description || 'No detailed description provided yet.'}
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Required Skills & Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-brand-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Meta Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Project Details</h3>
            
            <div className="flex items-center gap-3 text-xs">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500 block">Duration</span>
                <span className="font-semibold text-slate-200">{project.duration || '1-3 Months'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-200">{project.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500 block">Difficulty</span>
                <span className="font-semibold text-slate-200">{project.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Owner Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Project Creator</h3>
            <div className="flex items-center gap-3">
              <img
                src={project.owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner?.name}`}
                alt={project.owner?.name}
                className="w-12 h-12 rounded-xl object-cover bg-slate-800"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{project.owner?.name}</h4>
                <p className="text-xs text-brand-400 font-medium">{project.owner?.college || 'Student'}</p>
                <p className="text-[11px] text-slate-400">{project.owner?.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Join "{project.title}"</h3>
            <p className="text-xs text-slate-400">
              Send a note to the project owner highlighting your relevant skills and why you'd like to join!
            </p>
            <textarea
              rows={4}
              placeholder="Hi! I am a React/Node developer with experience building real-time apps..."
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowJoinModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                icon={Send}
                onClick={handleSendJoinRequest}
              >
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
