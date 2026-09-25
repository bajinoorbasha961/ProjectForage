import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Search, Flame, LogOut, User, Settings, Mail, Menu, X, PlusCircle, Sparkles } from 'lucide-react';
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
    <nav className="sticky top-0 z-40 glass-nav border-b border-brand-500/20 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-purple-300 hover:text-white rounded-xl hover:bg-brand-900/50"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-lavender-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.5),0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-all duration-300 border border-purple-300/30">
              <Sparkles className="w-5 h-5 fill-current animate-pulse text-lavender-100" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight leading-none block">
                Project <span className="text-lavender-gradient font-black">Forge</span>
              </span>
              <span className="text-[10px] text-purple-300 font-semibold tracking-wider uppercase hidden sm:block">
                Build • Collaborate • Innovate
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                placeholder="Search project title, skill (e.g. React, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#160d2b]/80 border border-purple-500/30 rounded-2xl pl-10 pr-4 py-2 text-sm text-purple-100 placeholder-purple-400/60 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 shadow-inner transition-all"
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
                  className="flex items-center gap-2 p-1.5 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 bg-[#160d2b]/90 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all hover:scale-105"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl bg-purple-950 object-cover border border-purple-400/30"
                  />
                  <span className="text-xs font-semibold text-purple-200 hidden md:block max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-[#160d2b]/95 border border-purple-500/40 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(168,85,247,0.2)] z-50 overflow-hidden py-1 backdrop-blur-2xl animate-fadeIn"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 bg-brand-950/60 border-b border-purple-500/20">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-purple-300 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-purple-200 hover:text-white hover:bg-brand-900/60 transition-colors font-medium"
                      >
                        <User className="w-4 h-4 text-brand-400" /> My Profile
                      </Link>
                      <Link
                        to="/invitations"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-purple-200 hover:text-white hover:bg-brand-900/60 transition-colors font-medium"
                      >
                        <Mail className="w-4 h-4 text-lavender-300" /> Team Invitations
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-purple-200 hover:text-white hover:bg-brand-900/60 transition-colors font-medium"
                      >
                        <Settings className="w-4 h-4 text-purple-400" /> Account Settings
                      </Link>
                    </div>

                    <div className="py-1 border-t border-purple-500/20">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/15 transition-colors font-medium"
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

