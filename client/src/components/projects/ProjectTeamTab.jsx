import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Shield, UserMinus, UserPlus, Mail, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '../../services/projectService';
import { invitationService } from '../../services/invitationService';
import { userService } from '../../services/userService';

const ROLES = ['Project Owner', 'Team Lead', 'Developer', 'Designer', 'Researcher', 'Tester', 'Other'];

export const ProjectTeamTab = ({ project, members, isOwner, onRefresh }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [inviteMessage, setInviteMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const res = await projectService.updateMemberRole(project._id, memberId, newRole);
      if (res.success) {
        toast.success('Member role updated');
        onRefresh();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;
    try {
      const res = await projectService.removeMember(project._id, memberId);
      if (res.success) {
        toast.success(`${memberName} removed from project team`);
        onRefresh();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    }
  };

  const openInviteModal = async () => {
    setShowInviteModal(true);
    setLoadingSearch(true);
    try {
      const res = await userService.getMatchingTeammates(project._id);
      if (res.success) {
        setCandidates(res.data);
      }
    } catch (err) {
      // quiet fail
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSendInvite = async () => {
    if (!selectedStudent) return;
    try {
      const res = await invitationService.createInvitation({
        projectId: project._id,
        recipientId: selectedStudent._id,
        message: inviteMessage,
      });
      if (res.success) {
        toast.success(`Invitation sent to ${selectedStudent.name}! 🎉`);
        setSelectedStudent(null);
        setInviteMessage('');
        setShowInviteModal(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send invitation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <h3 className="text-lg font-bold text-white">Project Team</h3>
          <p className="text-xs text-slate-400">
            {members.length} of {project.teamSize || 4} positions filled
          </p>
        </div>

        {isOwner && (
          <Button variant="primary" size="sm" icon={UserPlus} onClick={openInviteModal}>
            Invite Teammate
          </Button>
        )}
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((m) => {
          const user = m.user || {};
          const isMemberOwner = project.owner?._id === user._id || project.owner === user._id;

          return (
            <div
              key={m._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{user.name}</h4>
                      <p className="text-xs text-slate-400">{user.college || 'University'}</p>
                    </div>
                  </div>

                  <Badge variant={isMemberOwner ? 'brand' : 'slate'} size="xs">
                    {m.role || 'Member'}
                  </Badge>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {user.skills?.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Owner Controls */}
              {isOwner && !isMemberOwner && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m._id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        Role: {r}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveMember(m._id, user.name)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
                    title="Remove from team"
                  >
                    <UserMinus className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Invite Teammate Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl space-y-4 max-h-[85vh] flex flex-col">
            <h3 className="text-lg font-bold text-white">Invite Student to "{project.title}"</h3>
            <p className="text-xs text-slate-400">
              Below are students matched by skills required for your project:
            </p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingSearch ? (
                <div className="p-8 text-center text-slate-400 text-xs">Matching candidate profiles...</div>
              ) : candidates.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">No matching candidates available.</div>
              ) : (
                candidates.map((cand) => (
                  <div
                    key={cand._id}
                    onClick={() => setSelectedStudent(cand)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedStudent?._id === cand._id
                        ? 'bg-brand-500/10 border-brand-500 text-white'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cand.name}`}
                        alt={cand.name}
                        className="w-9 h-9 rounded-lg object-cover bg-slate-800"
                      />
                      <div>
                        <h4 className="font-semibold text-xs text-white">{cand.name}</h4>
                        <p className="text-[11px] text-slate-400">{cand.college}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {cand.matchPercentage || 50}% Match
                    </span>
                  </div>
                ))
              )}
            </div>

            {selectedStudent && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300">
                  Invitation Note to {selectedStudent.name}
                </label>
                <textarea
                  rows={2}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Hey! We love your React skills and want you on our team!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedStudent}
                icon={Mail}
                onClick={handleSendInvite}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
