import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Users,
  FolderKanban,
  CheckSquare,
  Mail,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  PlusCircle,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover Projects', path: '/projects', icon: Compass },
    { name: 'Find Teammates', path: '/teammates', icon: Users },
    { name: 'Team Invitations', path: '/invitations', icon: Mail },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-40 w-64 h-screen lg:h-[calc(100vh-61px)] bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <span className="font-bold text-white text-sm">Navigation</span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-10 h-10 rounded-lg bg-slate-800 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-brand-400 font-medium truncate">{user?.college || 'Student'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <NavLink
            to="/projects/create"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-brand-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Create Project
          </NavLink>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};
