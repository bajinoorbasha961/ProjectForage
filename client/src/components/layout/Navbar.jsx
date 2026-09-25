import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Search, Flame, LogOut, User, Settings, Mail, Menu, X, PlusCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 glass-nav border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight leading-none block">
                Project <span className="text-brand-400">Forge</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Build Ideas. Forge Projects.
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        {isAuthenticated && (
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search project title, skill (e.g. React, Python), category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
          </form>
        )}

        {/* Right Side: Navigation & User Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/projects/create" className="hidden sm:block">
                <Button variant="primary" size="sm" icon={PlusCircle}>
                  Create Project
                </Button>
              </Link>

              <NotificationDropdown />

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 transition-colors"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg bg-slate-800 object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-200 hidden md:block max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-1 divide-y divide-slate-800 animate-fadeIn"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 bg-slate-950/40">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <User className="w-4 h-4 text-brand-400" /> My Profile
                      </Link>
                      <Link
                        to="/invitations"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-emerald-400" /> Team Invitations
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" /> Account Settings
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
