import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useNexusStore } from '../store/nexusStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Ab prop drilling nahi — auth state seedha shared Zustand store se
  const isAuthenticated = useNexusStore((state) => state.isAuthenticated);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 bg-[#030712]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300">
      <div className="px-6 h-16 flex items-center justify-between">
        
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300">
            N
          </div>
          <span className="text-xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text">
            Nexus<span className="text-brand-primary">AI</span>
          </span>
        </Link>

        {/* Structural Desktop Menu Layout */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#metrics" className="hover:text-white transition-colors duration-200">Live Analytics</a>
          <a href="#features" className="hover:text-white transition-colors duration-200">System Features</a>
          <a href="#about" className="hover:text-white transition-colors duration-200">Framework</a>
          <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing Matrix</a>
          <a href="#contact" className="hover:text-white transition-colors duration-200">Contact</a>
        </div>
        
        <div className="hidden md:block">
          {/* Dynamic Button Base on Auth State */}
          <button 
            onClick={handleAuthAction}
            className="px-5 py-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer border border-slate-700 font-medium"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Access Terminal'}
          </button>
        </div>

        {/* Mobile Navbar State Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900/60 rounded-xl border border-slate-800/80"
          aria-label="Toggle Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#070b19]/95 backdrop-blur-2xl rounded-2xl p-6 flex flex-col gap-4 shadow-2xl border border-slate-800/80 animate-in fade-in slide-in-from-top-4 duration-300">
          <a href="#metrics" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white py-2.5 text-sm font-medium border-b border-slate-900/80 flex items-center justify-between">
            <span>Live Analytics</span>
            <span className="text-xs text-brand-primary font-mono">→</span>
          </a>
          <a href="#features" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white py-2.5 text-sm font-medium border-b border-slate-900/80 flex items-center justify-between">
            <span>System Features</span>
            <span className="text-xs text-brand-primary font-mono">→</span>
          </a>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white py-2.5 text-sm font-medium border-b border-slate-900/80 flex items-center justify-between">
            <span>Framework</span>
            <span className="text-xs text-brand-primary font-mono">→</span>
          </a>
          <a href="#pricing" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white py-2.5 text-sm font-medium border-b border-slate-900/80 flex items-center justify-between">
            <span>Pricing Matrix</span>
            <span className="text-xs text-brand-primary font-mono">→</span>
          </a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white py-2.5 text-sm font-medium border-b border-slate-900/80 flex items-center justify-between">
            <span>Contact</span>
            <span className="text-xs text-brand-primary font-mono">→</span>
          </a>
          <div className="pt-2">
            <button 
              onClick={() => { setIsOpen(false); handleAuthAction(); }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer text-center justify-center font-medium"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Access Terminal'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}