import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';
import Sidebar from '../components/Sidebar';

export default function ApiKeysPage() {
  useDocumentTitle('API Keys');
  const [apiKey, setApiKey] = useState('nexus_live_98f73b2a9104cde8761234567890');
  const [copied, setCopied] = useState(false);
  const [createdAt, setCreatedAt] = useState('July 25, 2026');
  const [statusMsg, setStatusMsg] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const handleGenerateKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey = `nexus_live_${randomHex}`;
    setApiKey(newKey);
    setCreatedAt(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    
    setStatusMsg('New production API key generated successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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

        {/* Top Header Card */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl card-container">
          <div>
            <h1 className="text-2xl font-black text-white title-text">API Keys & Tokens</h1>
            <p className="text-sm text-slate-400 mt-1">Manage Bearer tokens and credentials for secure backend integration.</p>
          </div>
          <Link 
            to="/dashboard" 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl transition border border-slate-700 btn-back flex items-center gap-2 font-medium"
          >
            <span>←</span> Back to Dashboard
          </Link>
        </div>

        {statusMsg && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl shadow-lg flex items-center gap-2">
            <span>✓</span> {statusMsg}
          </div>
        )}

        {/* API Key Management Card */}
        <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl card-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white title-text text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Production Secret Key
              </h3>
              <p className="text-xs text-slate-400 mt-1">Created on {createdAt} • Full access credentials</p>
            </div>
            <button 
              onClick={handleGenerateKey} 
              className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center gap-2"
            >
              <span>⚡</span> Generate New Key
            </button>
          </div>

          {/* Key Display Box */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Bearer Token</label>
            <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-sm text-indigo-300 shadow-inner">
              <span className="flex-1 truncate select-all">{apiKey}</span>
              <button 
                onClick={handleCopy} 
                className={`px-4 py-2 text-xs rounded-lg transition border font-medium cursor-pointer ${
                  copied 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                {copied ? 'Copied! ✓' : 'Copy Key'}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Keep your secret key secure. Do not share your API token in public repositories or client-side application code.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}