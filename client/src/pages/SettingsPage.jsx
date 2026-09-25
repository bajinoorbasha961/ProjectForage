import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, ShieldCheck, Key, User, Bell, LogOut } from 'lucide-react';
import { Button } from '../components/common/Button';

export const SettingsPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-slate-400" /> Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your account security, profile information, and platform preferences.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover bg-slate-800 border border-slate-700"
          />
          <div>
            <h3 className="font-bold text-white text-lg">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 mt-1">
              Active Student Account
            </span>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" /> Security & JWT Authentication
          </h4>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Encrypted Password</p>
              <p className="text-[11px] text-slate-400">Passwords are securely hashed using bcrypt salted hashing.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => alert('Password update feature active.')}>
              Change Password
            </Button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <Button variant="danger" size="sm" icon={LogOut} onClick={logout}>
            Sign Out of Account
          </Button>
        </div>
      </div>
    </div>
  );
};
