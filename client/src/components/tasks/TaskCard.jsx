import React from 'react';
import { Calendar, User, Flag, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TaskCard = ({ task, onStatusChange, onDelete, onEdit, isMember }) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <Badge variant="rose" size="xs">Urgent</Badge>;
      case 'High':
        return <Badge variant="amber" size="xs">High</Badge>;
      case 'Medium':
        return <Badge variant="brand" size="xs">Medium</Badge>;
      default:
        return <Badge variant="slate" size="xs">Low</Badge>;
    }
  };

  const statusOptions = ['Todo', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all shadow-md group">
      {/* Priority & Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {getPriorityBadge(task.priority)}
          {task.milestone && (
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] bg-slate-800 px-2 py-0.5 rounded">
              🎯 {task.milestone.title || task.milestone}
            </span>
          )}
        </div>

        {isMember && (
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="text-[11px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-xs font-semibold text-white leading-snug mb-1">{task.title}</h4>
        {task.description && (
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
        )}
      </div>

      {/* Footer Info: Assignee, Due Date & Quick Status Select */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          {task.assignedTo ? (
            <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignedTo.name}`}>
              <img
                src={task.assignedTo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo.name}`}
                alt={task.assignedTo.name}
                className="w-5 h-5 rounded-full object-cover bg-slate-800"
              />
              <span className="text-slate-300 font-medium truncate max-w-[80px]">
                {task.assignedTo.name}
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic">Unassigned</span>
          )}
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Quick Status Shift Selector */}
      {isMember && (
        <div className="pt-1">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-brand-500"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                Move to: {st}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
