import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Bell, CheckCheck, Check, FolderKanban, Users, MessageSquare, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all read');
    }
  };

  const handleMarkSingleRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      toast.error('Failed to mark read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED':
      case 'TASK_UPDATED':
        return <CheckSquare className="w-5 h-5 text-brand-400" />;
      case 'INVITATION_RECEIVED':
      case 'JOIN_REQUEST_RECEIVED':
      case 'MEMBER_JOINED':
        return <Users className="w-5 h-5 text-emerald-400" />;
      case 'PROJECT_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
      default:
        return <FolderKanban className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-brand-400" /> Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay updated with task assignments, milestone completions, and team invitations.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" icon={CheckCheck} onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications available right now.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                if (n.relatedProject) {
                  navigate(`/projects/${n.relatedProject._id || n.relatedProject}`);
                }
              }}
              className={`p-5 flex items-start justify-between gap-4 hover:bg-slate-850 transition-colors cursor-pointer ${
                !n.read ? 'bg-brand-500/5' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{n.title}</h4>
                    {!n.read && <Badge variant="brand" size="xs">New</Badge>}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-slate-500 block">
                    {new Date(n.createdAt).toLocaleDateString()} at{' '}
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={(e) => handleMarkSingleRead(n._id, e)}
                  className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Mark read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
