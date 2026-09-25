import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(formData);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleFillDemo = () => {
    setFormData({
      email: 'demo@projectforge.com',
      password: 'Demo@12345',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      {/* Glow */}
      <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        {/* Logo */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <span className="font-extrabold text-2xl text-white">Project Forge</span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">Welcome Back 👋</h2>
          <p className="text-xs text-slate-400">Sign in to manage your projects and team activity</p>
        </div>

        {/* Quick Demo Fill Banner */}
        <div
          onClick={handleFillDemo}
          className="mb-6 p-3.5 bg-brand-500/10 border border-brand-500/20 rounded-2xl cursor-pointer hover:bg-brand-500/15 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">One-Click Demo Account</span>
              <span className="text-[11px] text-brand-300">Email: demo@projectforge.com</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-brand-400 underline">Fill</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
