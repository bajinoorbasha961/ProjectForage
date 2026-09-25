import React, { useState } from 'react';
import { KanbanBoard } from '../tasks/KanbanBoard';
import { TaskModal } from '../tasks/TaskModal';
import { Button } from '../common/Button';
import { PlusCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskService } from '../../services/taskService';

export const ProjectTasksTab = ({ project, tasks, milestones, members, isMember, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState('All');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesMilestone =
      selectedMilestone === 'All' ||
      (task.milestone?._id || task.milestone) === selectedMilestone;
    return matchesSearch && matchesMilestone;
  });

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await taskService.updateTask(taskId, { status: newStatus });
      if (res.success) {
        toast.success(`Task moved to ${newStatus}`);
        onRefresh();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await taskService.deleteTask(taskId);
      if (res.success) {
        toast.success('Task deleted');
        onRefresh();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  const handleSaveTask = async (taskFormData) => {
    try {
      if (editingTask) {
        const res = await taskService.updateTask(editingTask._id, taskFormData);
        if (res.success) {
          toast.success('Task updated');
          onRefresh();
        }
      } else {
        const res = await taskService.createTask(project._id, taskFormData);
        if (res.success) {
          toast.success('Task created successfully 🎉');
          onRefresh();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save task');
    }
  };

  return (
    <div className="space-y-6">
      {/* Task Board Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Filter Milestone */}
          <div className="w-full sm:w-48">
            <select
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Milestones</option>
              {milestones.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isMember && (
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => {
              setEditingTask(null);
              setShowModal(true);
            }}
          >
            Create Task
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={filteredTasks}
        onStatusChange={handleStatusChange}
        onDeleteTask={handleDeleteTask}
        onEditTask={(t) => {
          setEditingTask(t);
          setShowModal(true);
        }}
        onCreateTaskClick={() => {
          setEditingTask(null);
          setShowModal(true);
        }}
        isMember={isMember}
      />

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveTask}
        initialData={editingTask}
        milestones={milestones}
        members={members}
      />
    </div>
  );
};
