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
  Sparkles,
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
          className="fixed inset-0 z-40 bg-[#0a0518]/80 backdrop-blur-md lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[65px] left-0 z-40 w-64 h-screen lg:h-[calc(100vh-65px)] bg-[#0d071e]/90 backdrop-blur-xl border-r border-purple-500/20 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20 lg:hidden">
          <span className="font-bold text-white text-sm">Navigation Menu</span>
          <button onClick={onClose} className="p-1 text-purple-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#170e2d]/80 border border-purple-500/30 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-10 h-10 rounded-xl bg-purple-950 object-cover border border-purple-400/40"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-brand-300 font-semibold truncate">{user?.college || 'Student Developer'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-extrabold text-purple-400/70 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-brand-400" /> Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600/30 to-brand-900/40 text-white border border-brand-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] font-bold translate-x-1'
                      : 'text-purple-300/80 hover:text-white hover:bg-brand-950/60 hover:translate-x-1'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-brand-400" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-purple-500/20 space-y-2">
          <NavLink
            to="/projects/create"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white font-bold text-xs rounded-xl shadow-[0_6px_0_#581c87,0_10px_20px_rgba(168,85,247,0.4)] active:translate-y-1 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Create Project
          </NavLink>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-purple-300/70 hover:text-rose-400 hover:bg-rose-500/15 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

