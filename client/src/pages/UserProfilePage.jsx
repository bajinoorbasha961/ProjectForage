import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ProjectCard } from '../components/projects/ProjectCard';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import {
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Edit,
  Save,
  Code,
  FolderKanban,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUserLocal } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    college: '',
    department: '',
    year: '',
    bio: '',
    skills: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  const isOwnProfile = !id || id === currentUser?._id;
  const targetId = id || currentUser?._id;

  const fetchProfile = async () => {
    try {
      const res = await userService.getUserById(targetId);
      if (res.success) {
        setProfileData(res.data);
        setEditForm({
          name: res.data.name || '',
          college: res.data.college || '',
          department: res.data.department || '',
          year: res.data.year || '',
          bio: res.data.bio || '',
          skills: res.data.skills ? res.data.skills.join(', ') : '',
          github: res.data.github || '',
          linkedin: res.data.linkedin || '',
          portfolio: res.data.portfolio || '',
        });
      }
    } catch (err) {
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetId]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.updateProfile(editForm);
      if (res.success) {
        toast.success('Profile updated successfully! 🎉');
        setIsEditing(false);
        updateUserLocal(res.data);
        fetchProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  if (!profileData) return null;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Profile Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={profileData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`}
              alt={profileData.name}
              className="w-24 h-24 rounded-2xl object-cover bg-slate-800 border-2 border-brand-500/30 shadow-xl"
            />
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{profileData.name}</h1>
              <p className="text-xs sm:text-sm text-brand-400 font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                {profileData.college || 'University'} • {profileData.department || 'Computer Science'} ({profileData.year || '3rd Year'})
              </p>
              {profileData.bio && (
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed italic">
                  "{profileData.bio}"
                </p>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <Button
              variant={isEditing ? 'outline' : 'primary'}
              size="sm"
              icon={Edit}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
          )}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-slate-800/80">
          {profileData.github && (
            <a
              href={profileData.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 transition-colors"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          {profileData.linkedin && (
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 bg-brand-500/10 px-3.5 py-1.5 rounded-xl border border-brand-500/20 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
          )}
          {profileData.portfolio && (
            <a
              href={profileData.portfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" /> Portfolio Website
            </a>
          )}
        </div>
      </div>

      {/* Edit Form Modal/Drawer */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-slate-900 border border-brand-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-fadeIn"
        >
          <h3 className="text-lg font-bold text-white mb-2">Edit Your Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College/University</label>
              <input
                type="text"
                value={editForm.college}
                onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
              <input
                type="text"
                value={editForm.year}
                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio</label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={editForm.skills}
              onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
              <input
                type="url"
                value={editForm.github}
                onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={editForm.linkedin}
                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Portfolio URL</label>
              <input
                type="url"
                value={editForm.portfolio}
                onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={Save}>
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {/* Skills Badges Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-brand-400" /> Technical Skills & Badges
        </h3>
        <div className="flex flex-wrap gap-2">
          {profileData.skills?.map((skill, index) => (
            <Badge key={index} variant="brand" size="md">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Associated Projects Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-purple-400" /> Projects ({profileData.projects?.length || 0})
        </h3>

        {profileData.projects?.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            No active projects associated with this profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.projects?.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
