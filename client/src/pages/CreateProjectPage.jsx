import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Button } from '../components/common/Button';
import { CATEGORIES } from '../components/projects/ProjectFilter';
import { PlusCircle, Sparkles, FolderPlus, Github, Globe, Image } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Intermediate',
    requiredSkills: '',
    teamSize: 4,
    duration: '2 Months',
    repositoryUrl: '',
    demoUrl: '',
    image: '',
    lookingForTeammates: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.shortDescription.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await projectService.createProject(formData);
      if (res.success) {
        toast.success('Project created successfully! 🎉');
        navigate(`/projects/${res.data._id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <FolderPlus className="w-7 h-7 text-brand-400" /> Create New Project
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Publish your project idea, specify required skills, and start building a high-performing student team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Project Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. AI-Powered Medical Diagnosis Assistant"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Short Tagline Summary <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={150}
            placeholder="Brief 1-2 sentence pitch explaining the core purpose of your project..."
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Detailed Overview & Goals
          </label>
          <textarea
            rows={5}
            placeholder="Explain the technical problem, proposed architecture, target audience, and key deliverables..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty Level</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Required Skills (comma separated)
          </label>
          <input
            type="text"
            placeholder="React, Node.js, Python, PyTorch, Figma, Socket.IO"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Team Size & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Team Size</label>
            <input
              type="number"
              min={1}
              max={20}
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 4 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Duration</label>
            <input
              type="text"
              placeholder="e.g. 2 Months"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Repository & Demo links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Repository URL</label>
            <div className="relative">
              <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="url"
                placeholder="https://github.com/username/project"
                value={formData.repositoryUrl}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Live Demo URL</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="url"
                placeholder="https://myproject.dev"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Looking for teammates toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.lookingForTeammates}
              onChange={(e) => setFormData({ ...formData, lookingForTeammates: e.target.checked })}
              className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <span className="font-semibold text-xs text-white block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Actively seeking teammates
              </span>
              <span className="text-[11px] text-slate-400">
                Allows students to send join requests for open roles on your team.
              </span>
            </div>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" size="md" onClick={() => navigate('/projects')}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" isLoading={isLoading} icon={PlusCircle}>
            Publish Project
          </Button>
        </div>
      </form>
    </div>
  );
};
