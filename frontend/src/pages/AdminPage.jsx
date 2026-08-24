import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNexusStore } from '../store/nexusStore';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api'
  : (import.meta.env.VITE_API_URL || '');

export default function AdminPage() {
  const token = useNexusStore((state) => state.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to load users.');
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [token]);

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-400">Admin Console</p>
            <h1 className="text-3xl font-black text-white">User Management</h1>
          </div>
          <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Dashboard</Link>
        </div>
        {error && <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">{error}</div>}
        {loading ? (
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70">No users found.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900">
                <tr><th className="text-left p-4">Email</th><th className="text-left p-4">Plan</th><th className="text-left p-4">Role</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-slate-800 bg-slate-950/60">
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.plan}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-300">{user.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
