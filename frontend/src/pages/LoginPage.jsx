import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNexusStore } from '../store/nexusStore';
import useDocumentTitle from '../utils/useDocumentTitle';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api'
  : (import.meta.env.VITE_API_URL || 'https://nexus-ai-production-72d2.up.railway.app/api');

export default function LoginPage() {
  useDocumentTitle('Log In');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginUser = useNexusStore((state) => state.loginUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      // Save token, email and role via Zustand store
      loginUser(data.token, email, data.role);
      
      // Navigate to dashboard after saving
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <form onSubmit={handleLogin} className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/30 mx-auto">
            N
          </div>
          <h2 className="text-2xl font-black text-white title-text">Login to Nexus AI</h2>
          <p className="text-xs text-slate-400">Authenticate to access your secure server telemetry dashboard.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm shadow-inner transition" 
              placeholder="user@nexus.ai" 
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm shadow-inner transition" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/30 text-sm disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account? <Link to="/signup" className="text-indigo-400 hover:underline font-medium">Signup</Link>
        </p>
      </form>
    </div>
  );
}