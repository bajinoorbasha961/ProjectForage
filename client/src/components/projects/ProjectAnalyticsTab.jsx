import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

const STATUS_COLORS = {
  Todo: '#94a3b8',
  'In Progress': '#0c8ee9',
  Review: '#f59e0b',
  Completed: '#10b981',
};

const PRIORITY_COLORS = {
  Low: '#64748b',
  Medium: '#0c8ee9',
  High: '#f59e0b',
  Urgent: '#f43f5e',
};

export const ProjectAnalyticsTab = ({ project, tasks, milestones }) => {
  // Compute Status Breakdown Data
  const statusCounts = { Todo: 0, 'In Progress': 0, Review: 0, Completed: 0 };
  tasks.forEach((t) => {
    if (statusCounts[t.status] !== undefined) {
      statusCounts[t.status]++;
    }
  });

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  // Compute Priority Breakdown Data
  const priorityCounts = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
  tasks.forEach((t) => {
    if (priorityCounts[t.priority] !== undefined) {
      priorityCounts[t.priority]++;
    }
  });

  const priorityData = Object.keys(priorityCounts).map((key) => ({
    name: key,
    tasks: priorityCounts[key],
  }));

  const totalTasks = tasks.length;
  const completedTasks = statusCounts.Completed;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Metrics Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Overall Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{progressPct}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Calculated from completed tasks</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Tasks</span>
            <Layers className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalTasks}</div>
          <p className="text-[11px] text-slate-500 mt-1">{completedTasks} completed, {totalTasks - completedTasks} pending</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Milestones Completed</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {milestones.filter((m) => m.status === 'Completed').length} / {milestones.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Project roadmap progress</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Urgent & High Tasks</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {priorityCounts.Urgent + priorityCounts.High}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tasks requiring immediate focus</p>
        </div>
      </div>

      {/* Visual Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white mb-4">Task Status Breakdown</h4>
          {totalTasks === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-500">
              No tasks available to visualize
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white mb-4">Tasks by Priority</h4>
          {totalTasks === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-500">
              No tasks available to visualize
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
                    {priorityData.map((entry) => (
                      <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
