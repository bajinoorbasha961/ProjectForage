import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { projectService } from '../services/projectService';
import { invitationService } from '../services/invitationService';
import { useAuth } from '../context/AuthContext';
import { TeammateCard } from '../components/teammates/TeammateCard';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Search, Users, Sparkles, Filter, X, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export const FindTeammatesPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [myOwnedProjects, setMyOwnedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [department, setDepartment] = useState('');
  const [college, setCollege] = useState('');

  // Invitation Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (skill) params.skill = skill;
      if (department) params.department = department;
      if (college) params.college = college;

      const res = await userService.getUsers(params);
      if (res.success) {
        // Exclude current logged in user from teammate search
        const filtered = res.data.filter((s) => s._id !== user?._id);
        setStudents(filtered);
      }
    } catch (err) {
      toast.error('Failed to load student profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, skill, department, college]);

  useEffect(() => {
    const fetchOwnedProjects = async () => {
      if (!user) return;
      try {
        const res = await projectService.getProjects({ owner: user._id });
        if (res.success) {
          const owned = res.data.filter(
            (p) => (p.owner?._id || p.owner) === user._id
          );
          setMyOwnedProjects(owned);
          if (owned.length > 0) setSelectedProjectId(owned[0]._id);
        }
      } catch (err) {
        // quiet fail
      }
    };
    fetchOwnedProjects();
  }, [user]);

  const handleInviteClick = (student) => {
    if (myOwnedProjects.length === 0) {
      toast.error('You need to create a project first before inviting teammates!');
      return;
    }
    setSelectedStudent(student);
  };

  const handleSendInviteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedProjectId) return;
    try {
      const res = await invitationService.createInvitation({
        projectId: selectedProjectId,
        recipientId: selectedStudent._id,
        message: inviteMessage,
      });
      if (res.success) {
        toast.success(`Invitation sent to ${selectedStudent.name}! 🎉`);
        setSelectedStudent(null);
        setInviteMessage('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send invitation');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-400" /> Find Teammates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search student developers by skills (React, Python, Machine Learning), college, or department.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* General Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student name or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Skill Filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by Skill (e.g. React, Node.js)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <input
              type="text"
              placeholder="Filter by Department..."
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* College Filter */}
          <div>
            <input
              type="text"
              placeholder="Filter by University..."
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {(search || skill || department || college) && (
          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setSearch('');
                setSkill('');
                setDepartment('');
                setCollege('');
              }}
              className="text-xs text-brand-400 hover:underline flex items-center gap-1 font-medium"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          title="No students matched your search"
          description="Try removing skill or university filters to view more student profiles."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSkill('');
            setDepartment('');
            setCollege('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <TeammateCard
              key={student._id}
              student={student}
              onInviteClick={handleInviteClick}
            />
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Invite ${selectedStudent.name} to Your Project`}
        >
          <form onSubmit={handleSendInviteSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Your Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              >
                {myOwnedProjects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Personal Invitation Note
              </label>
              <textarea
                rows={3}
                placeholder={`Hi ${selectedStudent.name}, we saw your impressive skills and would love to have you join our team!`}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Mail}>
                Send Invitation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
