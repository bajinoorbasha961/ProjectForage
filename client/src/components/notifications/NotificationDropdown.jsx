import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, FolderKanban, CheckSquare, Users, MessageSquare } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { Badge } from '../common/Badge';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      // quiet fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to mark read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleNotificationClick = (n) => {
    setIsOpen(false);
    if (n.relatedProject) {
      navigate(`/projects/${n.relatedProject._id || n.relatedProject}`);
    } else {
      navigate('/notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED':
      case 'TASK_UPDATED':
        return <CheckSquare className="w-4 h-4 text-brand-400" />;
      case 'INVITATION_RECEIVED':
      case 'JOIN_REQUEST_RECEIVED':
      case 'MEMBER_JOINED':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'PROJECT_MESSAGE':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <FolderKanban className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-lg shadow-brand-500/50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-white text-sm">Notifications</h4>
              {unreadCount > 0 && <Badge variant="brand">{unreadCount} New</Badge>}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer flex items-start space-x-3 ${
                    !n.read ? 'bg-brand-500/5' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                      {!n.read && (
                        <button
                          onClick={(e) => handleMarkRead(n._id, e)}
                          className="text-slate-400 hover:text-emerald-400 p-1"
                          title="Mark read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(n.createdAt).toLocaleDateString()} at{' '}
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-2.5 border-t border-slate-800 text-center bg-slate-950/40">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="text-xs font-medium text-brand-400 hover:text-brand-300"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
