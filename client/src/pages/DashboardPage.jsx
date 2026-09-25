import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  TrendingUp,
  Clock,
  PlusCircle,
  Activity,
  ArrowRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getDashboardData();
        if (res.success) {
          setDashboardData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = dashboardData?.stats || {
    projectsCreated: 0,
    projectsJoined: 0,
    tasksAssigned: 0,
    tasksCompleted: 0,
    overallCompletionPercentage: 0,
  };

  const myProjects = dashboardData?.myProjects || [];
  const upcomingTasks = dashboardData?.upcomingTasks || [];
  const recentActivities = dashboardData?.recentActivities || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900/80 via-slate-900 to-brand-950 border border-brand-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Student Developer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.name || 'Rahul'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            You have {upcomingTasks.length} upcoming tasks requiring your attention across your project teams.
          </p>
        </div>

        <div className="flex gap-3 z-10">
          <Link to="/projects/create">
            <button className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-brand-600/20 transition-all">
              <PlusCircle className="w-4 h-4" /> Create Project
            </button>
          </Link>
        </div>
      </div>

      {/* Statistics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Projects Created</span>
            <FolderKanban className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.projectsCreated}</div>
          <p className="text-[10px] text-slate-500 mt-1">Owned by you</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Projects Joined</span>
            <FolderKanban className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.projectsJoined}</div>
          <p className="text-[10px] text-slate-500 mt-1">Total memberships</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tasks Assigned</span>
            <CheckSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.tasksAssigned}</div>
          <p className="text-[10px] text-slate-500 mt-1">Active backlog</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tasks Completed</span>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.tasksCompleted}</div>
          <p className="text-[10px] text-slate-500 mt-1">Finished tasks</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Overall Completion</span>
            <TrendingUp className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.overallCompletionPercentage}%</div>
          <div className="mt-2">
            <ProgressBar progress={stats.overallCompletionPercentage} size="sm" showLabel={false} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-brand-400" /> My Projects
            </h2>
            <Link to="/projects" className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1">
              Explore All Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : myProjects.length === 0 ? (
            <EmptyState
              title="No projects joined yet"
              description="Explore existing student project ideas or create your own project to form a team."
              actionLabel="Explore Projects"
              onAction={() => (window.location.href = '/projects')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}

          {/* Upcoming Tasks Section */}
          <div className="pt-6 border-t border-slate-800/80 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Upcoming Tasks Assigned To You
            </h2>

            {upcomingTasks.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
                🎉 No pending tasks! You are completely up to date.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{task.title}</h4>
                        <Badge
                          variant={
                            task.priority === 'Urgent'
                              ? 'rose'
                              : task.priority === 'High'
                              ? 'amber'
                              : 'brand'
                          }
                          size="xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Project: <span className="text-slate-200">{task.project?.title || 'Team Project'}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <Badge variant="slate" size="xs">
                        {task.status}
                      </Badge>
                      {task.dueDate && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Activity Feed */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Recent Team Activity
            </h3>

            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No recent activity logged.</p>
              ) : (
                recentActivities.map((act) => (
                  <div key={act._id} className="flex items-start gap-3 text-xs border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <img
                      src={act.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user?.name}`}
                      alt={act.user?.name}
                      className="w-7 h-7 rounded-lg object-cover bg-slate-800 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-300">
                        <span className="font-bold text-white">{act.user?.name}</span>{' '}
                        {act.action}
                      </p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {new Date(act.createdAt).toLocaleDateString()} at{' '}
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
