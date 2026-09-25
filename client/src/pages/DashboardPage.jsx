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
  Layers,
  Zap,
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
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Welcome 3D Glass Banner */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden border-2 border-brand-400/40">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/40 text-brand-200 text-xs font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-brand-300 animate-spin-slow" /> Student Developer Portal 3D
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back, <span className="text-lavender-gradient text-lavender-glow">{user?.name || 'Rahul'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl font-medium">
            You have <span className="font-extrabold text-brand-300">{upcomingTasks.length} upcoming tasks</span> requiring your attention across your active project teams.
          </p>
        </div>

        <div className="flex gap-3 z-10">
          <Link to="/projects/create">
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-[0_6px_0_#581c87,0_10px_20px_rgba(168,85,247,0.4)] active:translate-y-1 transition-all">
              <PlusCircle className="w-4 h-4" /> Create Project
            </button>
          </Link>
        </div>
      </div>

      {/* Statistics Metric Cards with 3D Depth */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="glass-card-3d rounded-2xl p-5">
          <div className="flex items-center justify-between text-purple-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Created</span>
            <FolderKanban className="w-4 h-4 text-brand-300" />
          </div>
          <div className="text-3xl font-black text-white text-lavender-glow">{stats.projectsCreated}</div>
          <p className="text-[10px] text-purple-400 mt-1 font-semibold">Owned by you</p>
        </div>

        <div className="glass-card-3d rounded-2xl p-5">
          <div className="flex items-center justify-between text-purple-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Joined</span>
            <FolderKanban className="w-4 h-4 text-lavender-300" />
          </div>
          <div className="text-3xl font-black text-white text-lavender-glow">{stats.projectsJoined}</div>
          <p className="text-[10px] text-purple-400 mt-1 font-semibold">Total memberships</p>
        </div>

        <div className="glass-card-3d rounded-2xl p-5">
          <div className="flex items-center justify-between text-purple-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Assigned</span>
            <CheckSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white text-lavender-glow">{stats.tasksAssigned}</div>
          <p className="text-[10px] text-purple-400 mt-1 font-semibold">Active backlog</p>
        </div>

        <div className="glass-card-3d rounded-2xl p-5">
          <div className="flex items-center justify-between text-purple-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white text-lavender-glow">{stats.tasksCompleted}</div>
          <p className="text-[10px] text-purple-400 mt-1 font-semibold">Finished tasks</p>
        </div>

        <div className="glass-card-3d rounded-2xl p-5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-purple-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Rate</span>
            <TrendingUp className="w-4 h-4 text-brand-300" />
          </div>
          <div className="text-3xl font-black text-white text-lavender-glow">{stats.overallCompletionPercentage}%</div>
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
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-brand-300" /> My Projects
            </h2>
            <Link to="/projects" className="text-xs font-bold text-brand-300 hover:text-white flex items-center gap-1 transition-colors">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}

          {/* Upcoming Tasks Section */}
          <div className="pt-6 border-t border-purple-500/20 space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Upcoming Tasks Assigned To You
            </h2>

            {upcomingTasks.length === 0 ? (
              <div className="glass-card-3d rounded-2xl p-6 text-center text-xs text-purple-300 font-semibold">
                🎉 No pending tasks! You are completely up to date.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="glass-card-3d rounded-2xl p-4 flex items-center justify-between gap-4 transition-all"
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
                      <p className="text-[11px] text-purple-300 truncate">
                        Project: <span className="text-white font-semibold">{task.project?.title || 'Team Project'}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <Badge variant="slate" size="xs">
                        {task.status}
                      </Badge>
                      {task.dueDate && (
                        <div className="text-[10px] text-purple-300 flex items-center gap-1 justify-end font-medium">
                          <Calendar className="w-3 h-3 text-brand-300" />
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
          <div className="glass-card-3d rounded-3xl p-6 space-y-5">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-300" /> Recent Team Activity
            </h3>

            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-purple-400 italic">No recent activity logged.</p>
              ) : (
                recentActivities.map((act) => (
                  <div key={act._id} className="flex items-start gap-3 text-xs border-b border-purple-500/20 pb-3.5 last:border-0 last:pb-0">
                    <img
                      src={act.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user?.name}`}
                      alt={act.user?.name}
                      className="w-8 h-8 rounded-xl object-cover bg-purple-950 shrink-0 mt-0.5 border border-purple-400/40"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-purple-200">
                        <span className="font-bold text-white">{act.user?.name}</span>{' '}
                        {act.action}
                      </p>
                      <span className="text-[10px] text-purple-400 mt-1 block font-medium">
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

