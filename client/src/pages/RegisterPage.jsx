import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, User, Mail, Lock, GraduationCap, BookOpen, Calendar, ArrowRight, Code, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: '3rd Year',
    skills: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register(formData);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 py-12 relative">
      {/* 3D Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

      <div className="w-full max-w-xl glass-card-3d rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(168,85,247,0.3)] relative border-2 border-brand-400/40">
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-lavender-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]">
              <Sparkles className="w-6 h-6 fill-current animate-pulse text-lavender-100" />
            </div>
            <span className="font-black text-2xl text-white tracking-tight">Project <span className="text-lavender-gradient">Forge</span></span>
          </Link>
          <h2 className="text-2xl font-black text-white pt-2 tracking-tight">Create Student Account 🎉</h2>
          <p className="text-xs text-purple-200/80 font-medium">Join the 3D student developer collaboration network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  type="email"
                  required
                  placeholder="rahul@stanford.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">College/University</label>
              <input
                type="text"
                placeholder="Stanford University"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl px-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">Department</label>
              <input
                type="text"
                placeholder="Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl px-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">Year of Study</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl px-3 py-2.5 text-xs text-purple-100 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
              Skills (comma separated)
            </label>
            <div className="relative">
              <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                placeholder="React, Node.js, Python, MongoDB, Tailwind CSS"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">Bio</label>
            <textarea
              rows={2}
              placeholder="Tell teammates a little bit about your interests and past project experience..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-[#140b29]/90 border border-purple-500/30 rounded-2xl p-3 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 transition-all"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full py-3.5 text-base font-extrabold mt-2"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Create Account & Get Started
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-purple-300 font-medium">
          Already registered?{' '}
          <Link to="/login" className="font-extrabold text-brand-300 hover:text-white transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

