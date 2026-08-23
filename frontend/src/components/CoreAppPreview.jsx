import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Activity, ArrowLeft, Shield } from 'lucide-react';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function CoreAppPreview() {
  useDocumentTitle('Core Live Telemetry');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Activity className="w-8 h-8 text-indigo-500 animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold text-white">Nexus-AI Core Live Telemetry</h1>
              <p className="text-xs text-slate-400">Public architecture and global cluster node preview (Read-Only Mode)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Global Neural Cores</span>
              <h3 className="text-xl font-bold text-indigo-400 mt-1">1,248 Active</h3>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">System Latency</span>
              <h3 className="text-xl font-bold text-emerald-400 mt-1">14ms (Optimal)</h3>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Security Shield</span>
              <h3 className="text-xl font-bold text-violet-400 mt-1">Active / TLS 1.3</h3>
            </div>
          </div>

          {/* Grid Layout to display both sections side-by-side or stacked cleanly */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Option 1: Active Regional Edge Clusters */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" /> Active Regional Edge Clusters
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">us-east-1 (Virginia)</span>
                  <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 12ms</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">eu-central-1 (Frankfurt)</span>
                  <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 24ms</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300">ap-south-1 (Mumbai)</span>
                  <span className="text-amber-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> 42ms</span>
                </div>
              </div>
            </div>

            {/* Option 2: Live Security Diagnostics */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" /> Live Security Diagnostics
              </h3>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] font-mono space-y-2 text-slate-400">
                <p className="text-emerald-400">[INFO] JWT Bearer Token verified successfully.</p>
                <p className="text-slate-300">[SYNC] Encrypted payload routed to isolated user buffer.</p>
                <p className="text-indigo-400">[READY] Neural cluster weights optimized for telemetry stream.</p>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              onClick={() => navigate('/login')} 
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Sign In to Deploy Your Own Nodes   
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}