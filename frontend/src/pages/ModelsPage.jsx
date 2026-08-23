import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function ModelsPage() {
  useDocumentTitle('Models');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModel, setActiveModel] = useState('GPT-5 Neural Core');
  const [successMsg, setSuccessMsg] = useState('');
  const location = useLocation();

  useEffect(() => {
    const savedModel = localStorage.getItem('nexus_active_model');
    if (savedModel) {
      setActiveModel(savedModel);
    }
  }, []);

  const handleActivate = (modelName) => {
    setActiveModel(modelName);
    localStorage.setItem('nexus_active_model', modelName);
    setSuccessMsg(`Successfully activated ${modelName}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#030712] dark-transition text-slate-200 flex">
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/90 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between p-4 sticky top-0 h-screen z-20 backdrop-blur-xl card-container`}>
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
                N
              </div>
              {sidebarOpen && <span className="text-xl font-black text-white title-text tracking-wide">NexusAI</span>}
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { path: '/dashboard', label: 'Dashboard', icon: '📊' },
              { path: '/analytics', label: 'Analytics & Reports', icon: '📈' },
              { path: '/models', label: 'AI Models Hub', icon: '🤖' },
              { path: '/api-keys', label: 'API Keys & Tokens', icon: '🔑' },
              { path: '/profile', label: 'Profile', icon: '👤' },
              { path: '/settings', label: 'Settings', icon: '⚙️' },
              { path: '/billing', label: 'Billing', icon: '💳' },
            ].map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Toggle */}
        <div className="space-y-3 pt-4 border-t border-slate-800/60">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-xl transition cursor-pointer border border-slate-700/50"
          >
            {sidebarOpen ? '◀ Collapse' : '▶'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Models Hub</h1>
            <p className="text-sm text-slate-400">Switch between core LLM models and configure deployment weighting.</p>
          </div>
          <Link to="/dashboard" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl transition border border-slate-700">
            ← Back to Dashboard
          </Link>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl flex items-center gap-2 shadow-lg">
            <span>✓</span> {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* GPT-5 Neural Core */}
          <div className={`bg-slate-900 p-6 rounded-2xl border space-y-4 shadow-xl transition ${activeModel === 'GPT-5 Neural Core' ? 'border-indigo-500/80' : 'border-slate-800'}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">GPT-5 Neural Core</h3>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${activeModel === 'GPT-5 Neural Core' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                {activeModel === 'GPT-5 Neural Core' ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <p className="text-sm text-slate-400">Advanced multi-modal reasoning engine for enterprise workflows.</p>
            
            {activeModel === 'GPT-5 Neural Core' ? (
              <button 
                onClick={() => alert('Parameters configuration modal coming soon.')}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl transition border border-slate-700 cursor-pointer"
              >
                Configure Parameters
              </button>
            ) : (
              <button 
                onClick={() => handleActivate('GPT-5 Neural Core')}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Activate Model
              </button>
            )}
          </div>

          {/* Claude 4 Ultra */}
          <div className={`bg-slate-900 p-6 rounded-2xl border space-y-4 shadow-xl transition ${activeModel === 'Claude 4 Ultra' ? 'border-indigo-500/80' : 'border-slate-800'}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">Claude 4 Ultra</h3>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${activeModel === 'Claude 4 Ultra' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                {activeModel === 'Claude 4 Ultra' ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <p className="text-sm text-slate-400">High-speed conversational context handling and complex code analysis.</p>
            
            {activeModel === 'Claude 4 Ultra' ? (
              <button 
                onClick={() => alert('Parameters configuration modal coming soon.')}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl transition border border-slate-700 cursor-pointer"
              >
                Configure Parameters
              </button>
            ) : (
              <button 
                onClick={() => handleActivate('Claude 4 Ultra')}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Activate Model
              </button>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}