import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api'
  : (import.meta.env.VITE_API_URL || 'https://nexusaibackend-production.up.railway.app/api');

export default function SignupPage() {
  useDocumentTitle('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center px-4">
      <form onSubmit={handleSignup} className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Create Nexus AI Account</h2>
        {error && <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-400 text-sm rounded">{error}</div>}
        {message && <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm rounded">{message}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-300">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="user@nexus.ai" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded transition cursor-pointer">Signup</button>
        <p className="mt-4 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Login</Link></p>
      </form>
    </div>
  );
}