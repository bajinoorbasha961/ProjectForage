import React from 'react';
import { Flame, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-base text-white">Project Forge</span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed">
            The ultimate collaborative platform for university students to share project ideas, build real-world experience, and find teammates based on skill match.
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3">Platform</h5>
          <ul className="space-y-2">
            <li><Link to="/projects" className="hover:text-white transition-colors">Discover Projects</Link></li>
            <li><Link to="/teammates" className="hover:text-white transition-colors">Find Teammates</Link></li>
            <li><Link to="/projects/create" className="hover:text-white transition-colors">Create Project</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3">Categories</h5>
          <ul className="space-y-2">
            <li><Link to="/projects?category=Web+Development" className="hover:text-white transition-colors">Web Development</Link></li>
            <li><Link to="/projects?category=AI%2FML" className="hover:text-white transition-colors">AI & Machine Learning</Link></li>
            <li><Link to="/projects?category=Mobile+Development" className="hover:text-white transition-colors">Mobile Apps</Link></li>
            <li><Link to="/projects?category=Blockchain" className="hover:text-white transition-colors">Blockchain & Web3</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3">Connect</h5>
          <div className="flex gap-3 mb-4">
            <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
          <p className="text-[11px] text-slate-500">Built for college & university student developers globally.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} Project Forge. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Forged with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for student builders
        </p>
      </div>
    </footer>
  );
};
