import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Users,
  Compass,
  CheckSquare,
  MessageSquare,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Footer } from '../components/layout/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Nav */}
      <nav className="glass-nav sticky top-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight leading-none block">
              Project <span className="text-brand-400">Forge</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Build Ideas. Find Teammates. Forge Projects.
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
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
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 lg:px-12 max-w-7xl mx-auto w-full text-center">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-8">
          <Sparkles className="w-4 h-4" />
          The Premier Collaboration Platform for Student Developers
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight mb-6">
          Turn Your Ideas Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-emerald-400">Real Projects</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Project Forge helps university students find teammates, organize work, track milestones, and build high-impact portfolio projects together.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link to="/projects" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full gap-2" icon={Compass}>
              Explore Projects
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full gap-2">
              Create Your Project
            </Button>
          </Link>
        </div>

        {/* Highlight Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-900">
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-black text-white">500+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Student Builders</div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-black text-brand-400">120+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Active Projects</div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">95%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Match Accuracy</div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">2,500+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Tasks Completed</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-12 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How It Works</h2>
            <p className="text-slate-400 text-sm">
              Four simple steps to transform a casual idea into a fully deployed project with an extraordinary team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">Share Your Idea</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post your project concept, target category, tech stack, and required team roles.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Find Your Team</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use skill-based matching scores to discover and invite talented students across departments.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Build Together</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize work with interactive Kanban task boards, real-time team chat, and discussion boards.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">Track Your Progress</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete milestones, view automatic progress percentage metrics, and showcase your finished project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built For Student Engineers</h2>
          <p className="text-slate-400 text-sm">
            Everything you need to collaborate seamlessly without fragmented tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Project Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter projects by web dev, AI/ML, mobile, blockchain, game dev, difficulty, and skill requirements.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Skill-Based Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated percentage score algorithms match student profiles to project skill requirements instantly.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Kanban Task Board</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag-and-drop task workflow (TODO, IN PROGRESS, REVIEW, COMPLETED) with assignees and due dates.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Milestones Timeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Break down projects into structured roadmap phases with individual progress tracking.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Team Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Socket.IO powered instant room chat with message history and sender avatars.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Progress Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recharts visual analytics for task status breakdown, priority metrics, and overall completion rate.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-12 max-w-5xl mx-auto w-full mb-12">
        <div className="bg-gradient-to-r from-brand-900/90 via-slate-900 to-brand-950 border border-brand-500/30 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Forge Your Next Big Project?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join hundreds of student developers, designers, and researchers building real-world projects today.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
