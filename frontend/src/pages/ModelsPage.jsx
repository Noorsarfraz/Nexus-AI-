import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function ModelsPage() {
  useDocumentTitle('Models');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModel, setActiveModel] = useState('GPT-5 Neural Core');
  const [successMsg, setSuccessMsg] = useState('');

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
    <div className="min-h-screen bg-[#030712] dark-transition text-slate-200 flex relative">
      
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area - Fixed double scrollbar & added dynamic sidebar margin */}
      <main className={`flex-1 w-full min-w-0 p-6 md:p-10 space-y-8 relative transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden mb-2 flex items-center gap-2 text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl cursor-pointer w-fit"
        >
          ☰ <span className="text-sm">Menu</span>
        </button>

        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl card-container">
          <div>
            <h1 className="text-2xl font-black text-white title-text">AI Models Hub</h1>
            <p className="text-sm text-slate-400 mt-1">Switch between core LLM models and configure deployment weighting.</p>
          </div>
          <Link to="/dashboard" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl transition border border-slate-700 font-medium">
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
          <div className={`bg-slate-900 p-6 rounded-2xl border space-y-4 shadow-xl transition card-container ${activeModel === 'GPT-5 Neural Core' ? 'border-indigo-500/80' : 'border-slate-800'}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-lg title-text">GPT-5 Neural Core</h3>
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
          <div className={`bg-slate-900 p-6 rounded-2xl border space-y-4 shadow-xl transition card-container ${activeModel === 'Claude 4 Ultra' ? 'border-indigo-500/80' : 'border-slate-800'}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-lg title-text">Claude 4 Ultra</h3>
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