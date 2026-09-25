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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative">
      {/* 3D Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

      <div className="w-full max-w-md glass-card-3d rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(168,85,247,0.3)] relative border-2 border-brand-400/40">
        {/* Logo */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-lavender-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]">
              <Sparkles className="w-6 h-6 fill-current animate-pulse text-lavender-100" />
            </div>
            <span className="font-black text-2xl text-white tracking-tight">Project <span className="text-lavender-gradient">Forge</span></span>
          </Link>
          <h2 className="text-2xl font-black text-white pt-2 tracking-tight">Welcome Back 👋</h2>
          <p className="text-xs text-purple-200/80 font-medium">Sign in to access your 3D workspace & projects</p>
        </div>

        {/* Quick Demo Fill Banner */}
        <div
          onClick={handleFillDemo}
          className="mb-6 p-4 bg-brand-500/20 border border-brand-400/40 rounded-2xl cursor-pointer hover:bg-brand-500/30 transition-all flex items-center justify-between shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <div className="flex items-center gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-brand-300 shrink-0 animate-spin-slow" />
            <div>
              <span className="font-extrabold text-white block">One-Click Demo Account</span>
              <span className="text-[11px] text-purple-200">Email: demo@projectforge.com</span>
            </div>
          </div>
          <span className="text-xs font-black text-brand-300 underline">Fill</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl pl-11 pr-4 py-3 text-sm text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl pl-11 pr-4 py-3 text-sm text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full py-3.5 text-base font-extrabold"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-purple-300 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-extrabold text-brand-300 hover:text-white transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

