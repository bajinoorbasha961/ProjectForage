import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';
import { Flag, Plus, Calendar, CheckCircle2, Clock, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { milestoneService } from '../../services/milestoneService';

export const ProjectMilestonesTab = ({ project, milestones, isMember, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    status: 'Not Started',
  });

  const handleOpenModal = (m = null) => {
    if (m) {
      setEditingMilestone(m);
      setFormData({
        title: m.title || '',
        description: m.description || '',
        startDate: m.startDate ? new Date(m.startDate).toISOString().split('T')[0] : '',
        dueDate: m.dueDate ? new Date(m.dueDate).toISOString().split('T')[0] : '',
        status: m.status || 'Not Started',
      });
    } else {
      setEditingMilestone(null);
      setFormData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'Not Started',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMilestone) {
        const res = await milestoneService.updateMilestone(editingMilestone._id, formData);
        if (res.success) {
          toast.success('Milestone updated');
          onRefresh();
        }
      } else {
        const res = await milestoneService.createMilestone(project._id, formData);
        if (res.success) {
          toast.success('Milestone created 🎉');
          onRefresh();
        }
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save milestone');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    try {
      const res = await milestoneService.deleteMilestone(id);
      if (res.success) {
        toast.success('Milestone deleted');
        onRefresh();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete milestone');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <h3 className="text-lg font-bold text-white">Project Roadmap & Milestones</h3>
          <p className="text-xs text-slate-400">
            {milestones.filter((m) => m.status === 'Completed').length} of {milestones.length} milestones completed
          </p>
        </div>

        {isMember && (
          <Button variant="primary" size="sm" icon={Plus} onClick={() => handleOpenModal(null)}>
            Add Milestone
          </Button>
        )}
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No milestones created yet. Click "Add Milestone" to define project phases.
          </div>
        ) : (
          milestones.map((m, index) => (
            <div
              key={m._id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-400 text-sm">
                    M{index + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{m.title}</h4>
                    {m.description && <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      m.status === 'Completed'
                        ? 'emerald'
                        : m.status === 'In Progress'
                        ? 'brand'
                        : 'slate'
                    }
                  >
                    {m.status}
                  </Badge>

                  {isMember && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(m)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        title="Edit milestone"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Dates */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <ProgressBar progress={m.progress || 0} size="sm" />
                <div className="flex items-center justify-start md:justify-end gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Start:{' '}
                    {new Date(m.startDate).toLocaleDateString()}
                  </span>
                  {m.dueDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Due:{' '}
                      {new Date(m.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Milestone 1: UI Design & Wireframes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Describe deliverables for this milestone..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingMilestone ? 'Save Milestone' : 'Create Milestone'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
