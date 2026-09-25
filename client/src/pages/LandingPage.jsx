import React from 'react';
import { Link } from 'react-router-dom';
import Canvas3DBackground from '../components/common/Canvas3DBackground';
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
  Box,
  Layers,
  Cpu,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Footer } from '../components/layout/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* 3D Animated Canvas Background on Home Page */}
      <Canvas3DBackground />

      {/* Hero Section - Centered in exact middle */}
      <section className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center items-center py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full text-center z-10">
        {/* Ambient 3D Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-glow" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-lavender-400/20 rounded-full blur-[90px] -z-10 pointer-events-none" />

        {/* 3D Lavender Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#1e1038]/90 border border-brand-400/40 text-brand-300 text-xs font-bold mb-8 shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-xl animate-float-slow">
          <Sparkles className="w-4 h-4 text-brand-300 animate-spin-slow" />
          The Premier Collaboration Platform for Student Developers
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight mb-8">
          Turn Your Ideas Into <span className="text-lavender-gradient text-lavender-glow">Real Projects</span>
        </h1>

        <p className="text-base sm:text-xl text-purple-200/90 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Project Forge brings student developers, designers, and creators together to form teams, track milestones, and showcase portfolio projects in a high-octane workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-md mx-auto">
          <Link to="/projects" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full gap-2 text-base font-extrabold" icon={Compass}>
              Explore Projects
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full gap-2 text-base font-extrabold">
              Create Your Project
            </Button>
          </Link>
        </div>

        {/* Highlight 3D Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto w-full">
          <div className="glass-card-3d p-6 rounded-3xl text-center">
            <div className="text-3xl sm:text-4xl font-black text-white text-lavender-glow">500+</div>
            <div className="text-xs text-purple-300 mt-2 font-semibold uppercase tracking-wider">Student Builders</div>
          </div>
          <div className="glass-card-3d p-6 rounded-3xl text-center">
            <div className="text-3xl sm:text-4xl font-black text-brand-300 text-lavender-glow">120+</div>
            <div className="text-xs text-purple-300 mt-2 font-semibold uppercase tracking-wider">Active Projects</div>
          </div>
          <div className="glass-card-3d p-6 rounded-3xl text-center">
            <div className="text-3xl sm:text-4xl font-black text-lavender-300 text-lavender-glow">98%</div>
            <div className="text-xs text-purple-300 mt-2 font-semibold uppercase tracking-wider">Match Accuracy</div>
          </div>
          <div className="glass-card-3d p-6 rounded-3xl text-center">
            <div className="text-3xl sm:text-4xl font-black text-purple-200 text-lavender-glow">2,500+</div>
            <div className="text-xs text-purple-300 mt-2 font-semibold uppercase tracking-wider">Tasks Completed</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">How It Works</h2>
            <p className="text-purple-300 text-base">
              Four simple steps to transform a casual idea into a fully deployed project with an extraordinary team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card-3d p-7 rounded-3xl relative flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-black text-xl mb-5 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  01
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Share Your Idea</h3>
                <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
                  Post your project concept, target category, tech stack, and required team roles.
                </p>
              </div>
            </div>

            <div className="glass-card-3d p-7 rounded-3xl relative flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-lavender-600 to-lavender-400 text-white flex items-center justify-center font-black text-xl mb-5 shadow-[0_0_20px_rgba(196,139,255,0.5)]">
                  02
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Find Your Team</h3>
                <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
                  Use skill-based matching scores to discover and invite talented students across departments.
                </p>
              </div>
            </div>

            <div className="glass-card-3d p-7 rounded-3xl relative flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-purple-500 text-white flex items-center justify-center font-black text-xl mb-5 shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                  03
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Build Together</h3>
                <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
                  Organize work with interactive Kanban task boards, real-time team chat, and discussion boards.
                </p>
              </div>
            </div>

            <div className="glass-card-3d p-7 rounded-3xl relative flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-800 to-pink-600 text-white flex items-center justify-center font-black text-xl mb-5 shadow-[0_0_20px_rgba(219,39,119,0.5)]">
                  04
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Track Your Progress</h3>
                <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
                  Complete milestones, view automatic progress percentage metrics, and showcase your finished project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Built For Student Engineers</h2>
          <p className="text-purple-300 text-base">
            Everything you need to collaborate seamlessly without fragmented tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card-3d p-7 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-300 flex items-center justify-center border border-brand-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Project Discovery</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
              Filter projects by web dev, AI/ML, mobile, blockchain, game dev, difficulty, and skill requirements.
            </p>
          </div>

          <div className="glass-card-3d p-7 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-lavender-500/20 text-lavender-300 flex items-center justify-center border border-lavender-400/40 shadow-[0_0_15px_rgba(196,139,255,0.3)]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Skill-Based Matching</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
              Automated percentage score algorithms match student profiles to project skill requirements instantly.
            </p>
          </div>

          <div className="glass-card-3d p-7 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-300 flex items-center justify-center border border-brand-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Kanban Task Board</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
              Drag-and-drop task workflow (TODO, IN PROGRESS, REVIEW, COMPLETED) with assignees and due dates.
            </p>
          </div>

          <div className="glass-card-3d p-7 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/40 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Milestones Timeline</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
              Break down projects into structured roadmap phases with individual progress tracking.
            </p>
          </div>

          <div className="glass-card-3d p-7 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center border border-pink-400/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-Time Team Chat</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
              Socket.IO powered instant room chat with message history and sender avatars.
            </p>
          </div>

          <div className="glass-card-3d p-7 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-lavender-600/20 text-lavender-200 flex items-center justify-center border border-lavender-400/40 shadow-[0_0_15px_rgba(196,139,255,0.3)]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Progress Analytics</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
              Recharts visual analytics for task status breakdown, priority metrics, and overall completion rate.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto w-full mb-12 z-10 relative">
        <div className="glass-card-3d rounded-3xl p-12 text-center space-y-6 relative overflow-hidden border-2 border-brand-400/40">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-purple-600/20 to-brand-900/30 -z-10 pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Forge Your Next Big Project?
          </h2>
          <p className="text-base text-purple-200/90 max-w-xl mx-auto">
            Join hundreds of student developers, designers, and researchers building real-world projects today.
          </p>
          <div className="pt-4">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={ArrowRight} className="text-base px-8 py-3.5">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};


