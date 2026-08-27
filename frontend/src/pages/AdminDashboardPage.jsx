import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Users, ShieldCheck, UserCog, Server, UploadCloud, Search, RefreshCw, File as FileIcon } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';
import AdminSidebar from '../components/AdminSidebar';
import { SkeletonLoader } from '../components/SkeletonLoader';
import useDocumentTitle from '../utils/useDocumentTitle';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api'
  : (import.meta.env.VITE_API_URL || 'https://nexus-ai-production-72d2.up.railway.app/api');

const getAuthHeaders = () => {
  const token = safeSessionStorage.getItem('token') || safeLocalStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const formatBytes = (bytes) => {
  if (!bytes) return '0 KB';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
};

export default function AdminDashboardPage() {
  useDocumentTitle('Admin Panel');
  const logoutUser = useNexusStore((state) => state.logoutUser);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [searchParams] = useSearchParams();
  const activeView = ['dashboard', 'users', 'nodes', 'uploads', 'admins'].includes(searchParams.get('view'))
    ? searchParams.get('view')
    : 'dashboard';

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [uploads, setUploads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes, nodesRes, uploadsRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/admin/users`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/admin/nodes`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/admin/uploads`, { headers: getAuthHeaders() })
      ]);

      if ([statsRes, usersRes, nodesRes, uploadsRes].some((r) => r.status === 403)) {
        throw new Error('Access denied. Admin privileges required.');
      }

      const [statsData, usersData, nodesData, uploadsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        nodesRes.json(),
        uploadsRes.json()
      ]);

      if (!statsRes.ok) throw new Error(statsData.error || 'Failed to load stats.');
      if (!usersRes.ok) throw new Error(usersData.error || 'Failed to load users.');
      if (!nodesRes.ok) throw new Error(nodesData.error || 'Failed to load nodes.');
      if (!uploadsRes.ok) throw new Error(uploadsData.error || 'Failed to load uploads.');

      setStats(statsData);
      setUsers(usersData);
      setNodes(nodesData);
      setUploads(uploadsData);
    } catch (err) {
      setError(err.message || 'Something went wrong loading the admin panel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset the search box whenever the active section changes, so a
  // leftover query from "Users" doesn't silently filter "Uploads" too.
  useEffect(() => {
    setSearchTerm('');
  }, [activeView]);

  const handleRoleChange = async (userId, nextRole) => {
    setActionError('');
    setBusyId(userId);
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: nextRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role.');
      setUsers((prev) => prev.map((u) => (u._id === userId ? data.user : u)));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              adminCount: prev.adminCount + (nextRole === 'admin' ? 1 : -1),
              regularUserCount: prev.regularUserCount + (nextRole === 'admin' ? -1 : 1)
            }
          : prev
      );
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently? This also removes their nodes and uploads.')) return;
    setActionError('');
    setBusyId(userId);
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user.');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setStats((prev) => (prev ? { ...prev, totalUsers: prev.totalUsers - 1 } : prev));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (!window.confirm('Delete this AI node? This cannot be undone.')) return;
    setActionError('');
    setBusyId(nodeId);
    try {
      const res = await fetch(`${API_URL}/admin/nodes/${nodeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete node.');
      setNodes((prev) => prev.filter((n) => n._id !== nodeId));
      setStats((prev) => (prev ? { ...prev, totalNodes: prev.totalNodes - 1 } : prev));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    if (!window.confirm('Delete this file from Cloudinary and the database?')) return;
    setActionError('');
    setBusyId(uploadId);
    try {
      const res = await fetch(`${API_URL}/admin/uploads/${uploadId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete upload.');
      setUploads((prev) => prev.filter((u) => u._id !== uploadId));
      setStats((prev) => (prev ? { ...prev, totalUploads: prev.totalUploads - 1 } : prev));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const confirmLogout = () => {
    logoutUser();
    setShowLogoutModal(false);
    window.location.href = '/';
  };

  // =====================================================
  // CHART DATA — all derived from real fetched data.
  // =====================================================

  const roleDistribution = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Regular Users', value: stats.regularUserCount },
      { name: 'Admins', value: stats.adminCount }
    ].filter((entry) => entry.value > 0);
  }, [stats]);

  const entityTotals = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Users', count: stats.totalUsers },
      { name: 'AI Nodes', count: stats.totalNodes },
      { name: 'Uploads', count: stats.totalUploads }
    ];
  }, [stats]);

  const signupTrend = useMemo(() => {
    if (users.length === 0) return [];
    const byDay = {};
    users.forEach((u) => {
      if (!u.createdAt) return;
      const d = new Date(u.createdAt);
      if (Number.isNaN(d.getTime())) return;
      const key = d.toISOString().split('T')[0];
      byDay[key] = (byDay[key] || 0) + 1;
    });
    const sortedDays = Object.keys(byDay).sort();
    let cumulative = 0;
    return sortedDays.map((day) => {
      cumulative += byDay[day];
      return {
        date: new Date(`${day}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        signups: cumulative
      };
    });
  }, [users]);

  const admins = useMemo(() => users.filter((u) => u.role === 'admin'), [users]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.trim().toLowerCase();
    return users.filter((u) => u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, searchTerm]);

  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) return nodes;
    const q = searchTerm.trim().toLowerCase();
    return nodes.filter((n) => n.title?.toLowerCase().includes(q) || n.userEmail?.toLowerCase().includes(q) || n.status?.toLowerCase().includes(q));
  }, [nodes, searchTerm]);

  const filteredUploads = useMemo(() => {
    if (!searchTerm.trim()) return uploads;
    const q = searchTerm.trim().toLowerCase();
    return uploads.filter((u) => u.originalName?.toLowerCase().includes(q) || u.userEmail?.toLowerCase().includes(q));
  }, [uploads, searchTerm]);

  const filteredAdmins = useMemo(() => {
    if (!searchTerm.trim()) return admins;
    const q = searchTerm.trim().toLowerCase();
    return admins.filter((a) => a.email.toLowerCase().includes(q));
  }, [admins, searchTerm]);

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, Icon: Users, color: 'indigo' },
        { label: 'Admins', value: stats.adminCount, Icon: ShieldCheck, color: 'violet' },
        { label: 'Regular Users', value: stats.regularUserCount, Icon: UserCog, color: 'cyan' },
        { label: 'AI Nodes (all users)', value: stats.totalNodes, Icon: Server, color: 'emerald' },
        { label: 'Uploads (all users)', value: stats.totalUploads, Icon: UploadCloud, color: 'amber' }
      ]
    : [];

  const colorClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };

  const VIEW_TITLES = {
    dashboard: ['Dashboard', 'Platform-wide stats and activity trends.'],
    users: ['Users', 'All registered users — search, promote/revoke, or delete.'],
    nodes: ['AI Nodes', 'Every deployed AI node across every user, in one place.'],
    uploads: ['Uploads', 'Every file uploaded across every user, in one place.'],
    admins: ['Admin Management', 'Accounts with admin privileges on this platform.']
  };
  const [viewTitle, viewSubtitle] = VIEW_TITLES[activeView];

  const searchPlaceholders = {
    users: 'Search by email or role...',
    nodes: 'Search by title, owner, or status...',
    uploads: 'Search by filename or owner...',
    admins: 'Search admins by email...'
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      <main className="flex-1 min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto h-screen">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden mb-2 text-slate-400 hover:text-white text-2xl leading-none"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white title-text">{viewTitle}</h1>
          <p className="text-sm text-slate-400 mt-1">{viewSubtitle}</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : !error ? (
          <>
            {/* Stat cards — shown on Dashboard only */}
            {activeView === 'dashboard' && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-mono">{card.label}</p>
                        <p className="text-2xl font-black text-white mt-2">{card.value}</p>
                      </div>
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colorClasses[card.color]}`}>
                        <card.Icon size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6">
                  <h2 className="text-base font-bold text-white">User Signups Over Time</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-5">Cumulative accounts created, based on each user's join date</p>
                  <div className="h-[260px] w-full">
                    {signupTrend.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-sm text-slate-500">
                        Not enough signup history yet.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={signupTrend}>
                          <defs>
                            <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                          <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }}
                          />
                          <Area type="monotone" dataKey="signups" stroke="#6366f1" strokeWidth={3} fill="url(#signupGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6">
                    <h2 className="text-base font-bold text-white">Platform Totals</h2>
                    <p className="text-xs text-slate-500 mt-1 mb-5">Users, AI nodes, and uploads across every account</p>
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={entityTotals}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                          <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }}
                          />
                          <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6">
                    <h2 className="text-base font-bold text-white">Role Distribution</h2>
                    <p className="text-xs text-slate-500 mt-1 mb-5">Admins vs. regular users</p>
                    <div className="h-[260px] w-full">
                      {roleDistribution.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-sm text-slate-500">No users yet.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={roleDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={100}
                              paddingAngle={4}
                              dataKey="value"
                              nameKey="name"
                            >
                              {roleDistribution.map((entry, index) => (
                                <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shared search bar for the four table-based sections */}
            {activeView !== 'dashboard' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-white">
                    {activeView === 'users' && `All Users (${filteredUsers.length})`}
                    {activeView === 'nodes' && `All AI Nodes (${filteredNodes.length})`}
                    {activeView === 'uploads' && `All Uploads (${filteredUploads.length})`}
                    {activeView === 'admins' && `Admins (${filteredAdmins.length})`}
                  </h2>
                  <div className="flex items-center gap-3">
                    {actionError && <span className="text-xs text-red-400">{actionError}</span>}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={searchPlaceholders[activeView]}
                        className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                      />
                    </div>
                    <button
                      onClick={loadData}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                      title="Refresh"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>

                {/* ---------------- USERS ---------------- */}
                {activeView === 'users' && (
                  filteredUsers.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">
                      {searchTerm ? `No users match "${searchTerm}".` : 'No users found.'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-400 border-b border-slate-800 uppercase text-xs tracking-wider">
                            <th className="p-4">Email</th>
                            <th className="p-4">Plan</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u._id} className="border-b border-slate-800/60 last:border-0">
                              <td className="p-4 text-slate-200">{u.email}</td>
                              <td className="p-4 text-slate-400">{u.plan}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                    u.role === 'admin'
                                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                                  }`}
                                >
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500 text-xs">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                              </td>
                              <td className="p-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    disabled={busyId === u._id}
                                    onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition disabled:opacity-50 cursor-pointer"
                                  >
                                    {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                  </button>
                                  <button
                                    disabled={busyId === u._id}
                                    onClick={() => handleDeleteUser(u._id)}
                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition disabled:opacity-50 cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* ---------------- AI NODES ---------------- */}
                {activeView === 'nodes' && (
                  filteredNodes.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">
                      {searchTerm ? `No nodes match "${searchTerm}".` : 'No AI nodes have been deployed yet.'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-400 border-b border-slate-800 uppercase text-xs tracking-wider">
                            <th className="p-4">Title</th>
                            <th className="p-4">Owner</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Deployed</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredNodes.map((n) => (
                            <tr key={n._id} className="border-b border-slate-800/60 last:border-0">
                              <td className="p-4 text-slate-200">{n.title}</td>
                              <td className="p-4 text-slate-400">{n.userEmail}</td>
                              <td className="p-4">
                                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                  {n.status}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500 text-xs">
                                {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '—'}
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  disabled={busyId === n._id}
                                  onClick={() => handleDeleteNode(n._id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition disabled:opacity-50 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* ---------------- UPLOADS ---------------- */}
                {activeView === 'uploads' && (
                  filteredUploads.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">
                      {searchTerm ? `No uploads match "${searchTerm}".` : 'No files have been uploaded yet.'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-400 border-b border-slate-800 uppercase text-xs tracking-wider">
                            <th className="p-4">File</th>
                            <th className="p-4">Owner</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Size</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUploads.map((f) => (
                            <tr key={f._id} className="border-b border-slate-800/60 last:border-0">
                              <td className="p-4 text-slate-200">
                                <a
                                  href={f.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 hover:text-indigo-400 transition"
                                >
                                  <FileIcon size={14} className="text-slate-500 shrink-0" />
                                  <span className="truncate max-w-[220px]">{f.originalName}</span>
                                </a>
                              </td>
                              <td className="p-4 text-slate-400">{f.userEmail}</td>
                              <td className="p-4 text-slate-500 text-xs">{f.mimetype || '—'}</td>
                              <td className="p-4 text-slate-500 text-xs">{formatBytes(f.sizeBytes)}</td>
                              <td className="p-4 text-right">
                                <button
                                  disabled={busyId === f._id}
                                  onClick={() => handleDeleteUpload(f._id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition disabled:opacity-50 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* ---------------- ADMIN MANAGEMENT ---------------- */}
                {activeView === 'admins' && (
                  filteredAdmins.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">
                      {searchTerm ? `No admins match "${searchTerm}".` : 'No admins found.'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-400 border-b border-slate-800 uppercase text-xs tracking-wider">
                            <th className="p-4">Email</th>
                            <th className="p-4">Admin Since</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAdmins.map((a) => (
                            <tr key={a._id} className="border-b border-slate-800/60 last:border-0">
                              <td className="p-4 text-slate-200 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-indigo-400" /> {a.email}
                              </td>
                              <td className="p-4 text-slate-500 text-xs">
                                {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  disabled={busyId === a._id}
                                  onClick={() => handleRoleChange(a._id, 'user')}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition disabled:opacity-50 cursor-pointer"
                                >
                                  Revoke Admin
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        ) : null}
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-white font-bold text-lg">Log out?</h3>
            <p className="text-slate-400 text-sm">You'll need to log in again to access the admin panel.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-sm font-medium transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}