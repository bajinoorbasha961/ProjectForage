import React, { useState, useEffect } from 'react';
import { invitationService } from '../services/invitationService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Mail, Check, X, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const MyInvitationsPage = () => {
  const [data, setData] = useState({
    invitations: [],
    myJoinRequests: [],
    receivedJoinRequests: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    try {
      const res = await invitationService.getUserInvitations();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleRespondInvitation = async (id, status) => {
    try {
      const res = await invitationService.respondInvitation(id, status);
      if (res.success) {
        toast.success(`Invitation ${status.toLowerCase()} successfully!`);
        fetchInvitations();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to respond to invitation');
    }
  };

  const handleRespondJoinRequest = async (id, status) => {
    try {
      const res = await invitationService.respondJoinRequest(id, status);
      if (res.success) {
        toast.success(`Join request ${status.toLowerCase()} successfully!`);
        fetchInvitations();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to respond to join request');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Mail className="w-7 h-7 text-emerald-400" /> Team Invitations & Join Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage invitations you've received from project owners, and respond to join requests for your own projects.
        </p>
      </div>

      {/* Section 1: Received Project Invitations */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          Project Invitations Sent To You ({data.invitations.length})
        </h2>

        {data.invitations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            You currently have no pending team invitations.
          </div>
        ) : (
          <div className="space-y-3">
            {data.invitations.map((inv) => (
              <div
                key={inv._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">
                      {inv.project?.title || 'Project'}
                    </h3>
                    <Badge variant={inv.status === 'Accepted' ? 'emerald' : inv.status === 'Rejected' ? 'rose' : 'amber'}>
                      {inv.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{inv.message}"</p>
                  <p className="text-[11px] text-slate-400">
                    Invited by <span className="font-semibold text-slate-200">{inv.sender?.name}</span> ({inv.sender?.college})
                  </p>
                </div>

                {inv.status === 'Pending' ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={X}
                      onClick={() => handleRespondInvitation(inv._id, 'Rejected')}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      icon={Check}
                      onClick={() => handleRespondInvitation(inv._id, 'Accepted')}
                    >
                      Accept Invitation
                    </Button>
                  </div>
                ) : (
                  <Link to={`/projects/${inv.project?._id}`}>
                    <Button variant="secondary" size="sm" icon={ArrowRight}>
                      View Project
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Join Requests for My Projects */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          Join Requests For Your Projects ({data.receivedJoinRequests.length})
        </h2>

        {data.receivedJoinRequests.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            No student join requests for your projects yet.
          </div>
        ) : (
          <div className="space-y-3">
            {data.receivedJoinRequests.map((req) => (
              <div
                key={req._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={req.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.user?.name}`}
                    alt={req.user?.name}
                    className="w-10 h-10 rounded-xl object-cover bg-slate-800 shrink-0 mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{req.user?.name}</h4>
                      <Badge variant={req.status === 'Accepted' ? 'emerald' : req.status === 'Rejected' ? 'rose' : 'amber'}>
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      Wants to join <span className="font-semibold text-slate-200">{req.project?.title}</span>
                    </p>
                    {req.message && <p className="text-xs text-slate-300 italic">"{req.message}"</p>}
                  </div>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={X}
                      onClick={() => handleRespondJoinRequest(req._id, 'Rejected')}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      icon={Check}
                      onClick={() => handleRespondJoinRequest(req._id, 'Accepted')}
                    >
                      Approve & Add to Team
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
