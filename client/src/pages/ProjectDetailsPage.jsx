import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { milestoneService } from '../services/milestoneService';
import { useAuth } from '../context/AuthContext';
import { ProjectOverviewTab } from '../components/projects/ProjectOverviewTab';
import { ProjectTeamTab } from '../components/projects/ProjectTeamTab';
import { ProjectTasksTab } from '../components/projects/ProjectTasksTab';
import { ProjectMilestonesTab } from '../components/projects/ProjectMilestonesTab';
import { ProjectDiscussionTab } from '../components/projects/ProjectDiscussionTab';
import { ProjectChatTab } from '../components/projects/ProjectChatTab';
import { ProjectAnalyticsTab } from '../components/projects/ProjectAnalyticsTab';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import {
  Info,
  Users,
  CheckSquare,
  Flag,
  MessageSquare,
  MessageCircle,
  BarChart2,
  Trash2,
  Edit,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchProjectDetails = async () => {
    try {
      const res = await projectService.getProjectById(id);
      if (res.success) {
        setProjectData(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Project not found');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!projectData) return null;

  const members = projectData.members || [];
  const tasks = projectData.tasks || [];
  const milestones = projectData.milestones || [];

  const isMember = user
    ? members.some((m) => (m.user?._id || m.user) === user._id)
    : false;

  const isOwner = user
    ? (projectData.owner?._id || projectData.owner) === user._id
    : false;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'team', label: `Team (${members.length})`, icon: Users },
    { id: 'tasks', label: `Tasks (${tasks.length})`, icon: CheckSquare },
    { id: 'milestones', label: `Milestones (${milestones.length})`, icon: Flag },
    { id: 'discussion', label: 'Discussion', icon: MessageSquare },
    { id: 'chat', label: 'Team Chat', icon: MessageCircle, highlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) return;
    try {
      const res = await projectService.deleteProject(projectData._id);
      if (res.success) {
        toast.success('Project deleted successfully');
        navigate('/projects');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Projects</span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-white truncate max-w-[200px]">
            {projectData.title}
          </span>
        </div>

        {isOwner && (
          <button
            onClick={handleDeleteProject}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Project
          </button>
        )}
      </div>

      {/* Tabs Navigation Header */}
      <div className="border-b border-slate-800 overflow-x-auto no-scrollbar">
        <div className="flex space-x-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 ${
                  isActive
                    ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <ProjectOverviewTab
            project={projectData}
            isMember={isMember}
            onJoinSuccess={fetchProjectDetails}
          />
        )}
        {activeTab === 'team' && (
          <ProjectTeamTab
            project={projectData}
            members={members}
            isOwner={isOwner}
            onRefresh={fetchProjectDetails}
          />
        )}
        {activeTab === 'tasks' && (
          <ProjectTasksTab
            project={projectData}
            tasks={tasks}
            milestones={milestones}
            members={members}
            isMember={isMember}
            onRefresh={fetchProjectDetails}
          />
        )}
        {activeTab === 'milestones' && (
          <ProjectMilestonesTab
            project={projectData}
            milestones={milestones}
            isMember={isMember}
            onRefresh={fetchProjectDetails}
          />
        )}
        {activeTab === 'discussion' && (
          <ProjectDiscussionTab project={projectData} isMember={isMember} />
        )}
        {activeTab === 'chat' && <ProjectChatTab project={projectData} isMember={isMember} />}
        {activeTab === 'analytics' && (
          <ProjectAnalyticsTab
            project={projectData}
            tasks={tasks}
            milestones={milestones}
          />
        )}
      </div>
    </div>
  );
};
