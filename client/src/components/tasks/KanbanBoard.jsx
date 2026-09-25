import React from 'react';
import { TaskCard } from './TaskCard';
import { Plus, CheckCircle2, Circle, Clock, CheckSquare } from 'lucide-react';
import { Button } from '../common/Button';

const COLUMNS = [
  { id: 'Todo', title: 'TODO', icon: Circle, color: 'text-slate-400 border-slate-700 bg-slate-900/50' },
  { id: 'In Progress', title: 'IN PROGRESS', icon: Clock, color: 'text-brand-400 border-brand-500/30 bg-brand-500/5' },
  { id: 'Review', title: 'IN REVIEW', icon: CheckSquare, color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
  { id: 'Completed', title: 'COMPLETED', icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
];

export const KanbanBoard = ({ tasks, onStatusChange, onDeleteTask, onEditTask, onCreateTaskClick, isMember }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const ColumnIcon = col.icon;
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className={`flex flex-col rounded-2xl border p-4 min-h-[500px] ${col.color}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ColumnIcon className="w-4 h-4" />
                <h3 className="font-bold text-xs text-white tracking-wider">{col.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                  {columnTasks.length}
                </span>
              </div>
              {isMember && col.id === 'Todo' && (
                <button
                  onClick={onCreateTaskClick}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Add Task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Task List */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[70vh] pr-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-800/80 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">No tasks in {col.title}</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                    isMember={isMember}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
