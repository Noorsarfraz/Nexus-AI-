import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5001/api'
    : import.meta.env.VITE_API_URL ||
      'https://nexus-ai-production-72d2.up.railway.app/api';

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
];

export default function AnalyticsPage() {
  useDocumentTitle('Analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const [uploads, setUploads] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [nodeStatusFilter, setNodeStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    '';

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [uploadsRes, nodesRes] = await Promise.all([
        fetch(`${API_URL}/uploads`, { headers }),
        fetch(`${API_URL}/nodes`, { headers }),
      ]);

      const uploadsData = await uploadsRes.json();
      const nodesData = await nodesRes.json();

      if (!uploadsRes.ok) {
        throw new Error(uploadsData.error || 'Unable to fetch uploads.');
      }

      if (!nodesRes.ok) {
        throw new Error(nodesData.error || 'Unable to fetch nodes.');
      }

      setUploads(Array.isArray(uploadsData) ? uploadsData : []);
      setNodes(Array.isArray(nodesData) ? nodesData : []);
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.message || 'Unable to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  // Filter Uploads by Date and File Type
  const filteredUploads = useMemo(() => {
    let result = uploads;

    if (dateFilter !== 'all') {
      const now = new Date();
      const days =
        dateFilter === '7days'
          ? 7
          : dateFilter === '30days'
          ? 30
          : 90;

      const startDate = new Date(now);
      startDate.setDate(now.getDate() - days);

      result = result.filter((item) => {
        if (!item.createdAt) return false;
        const uploadDate = new Date(item.createdAt);
        return uploadDate >= startDate;
      });
    }

    if (fileTypeFilter !== 'all') {
      result = result.filter((file) => {
        let type = 'Other';
        if (file.mimetype) {
          if (file.mimetype.startsWith('image/')) {
            type = 'Images';
          } else if (file.mimetype === 'application/pdf') {
            type = 'PDF';
          } else {
            type = 'Other';
          }
        }
        return type.toLowerCase() === fileTypeFilter.toLowerCase();
      });
    }

    return result;
  }, [uploads, dateFilter, fileTypeFilter]);

  // Filter Nodes by Status Dropdown
  const filteredNodes = useMemo(() => {
    if (nodeStatusFilter === 'all') {
      return nodes;
    }
    return nodes.filter((node) => {
      const status = String(node.status || '').toLowerCase();
      return status === nodeStatusFilter.toLowerCase();
    });
  }, [nodes, nodeStatusFilter]);

  const totalUploads = filteredUploads.length;
  const totalNodes = filteredNodes.length;

  const activeNodes = filteredNodes.filter((node) => {
    const status = String(node.status || '').toLowerCase();
    return (
      status.includes('active') ||
      status.includes('optimizing') ||
      status.includes('Stopped')
    );
  }).length;

  const totalStorage = filteredUploads.reduce(
    (total, item) => total + Number(item.sizeBytes || 0),
    0
  );

  const totalStorageMB = (totalStorage / (1024 * 1024)).toFixed(2);

  const nodeStatusData = useMemo(() => {
    const statusMap = {};
    filteredNodes.forEach((node) => {
      const status = node.status || 'Unknown';
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));
  }, [filteredNodes]);

  const fileTypeData = useMemo(() => {
    const typeMap = {};
    filteredUploads.forEach((file) => {
      let type = 'Other';
      if (file.mimetype) {
        if (file.mimetype.startsWith('image/')) {
          type = 'Images';
        } else if (file.mimetype === 'application/pdf') {
          type = 'PDF';
        } else {
          type = 'Other';
        }
      }
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    return Object.entries(typeMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredUploads]);

  const uploadActivityData = useMemo(() => {
    const activityMap = {};
    filteredUploads.forEach((file) => {
      if (!file.createdAt) return;
      const date = new Date(file.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = date.toISOString().split('T')[0];
      activityMap[key] = (activityMap[key] || 0) + 1;
    });

    const sortedDates = Object.keys(activityMap).sort();
    return sortedDates.map((date) => {
      const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return {
        date: formattedDate,
        uploads: activityMap[date],
      };
    });
  }, [filteredUploads]);

  return (
    <div className="min-h-screen bg-[#030712] dark-transition text-slate-200 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/90 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between p-4 sticky top-0 h-screen z-20 backdrop-blur-xl card-container`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
                N
              </div>
              {sidebarOpen && <span className="text-xl font-black text-white title-text tracking-wide">NexusAI</span>}
            </Link>
          </div>

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
        {loading ? (
          <section className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-slate-400">Loading analytics...</p>
              </div>
            </div>
          </section>
        ) : error ? (
          <section className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <div className="text-center py-10">
              <div className="text-4xl mb-3">⚠️</div>
              <h2 className="text-lg font-bold text-white mb-2">Analytics unavailable</h2>
              <p className="text-sm text-red-400 mb-5">{error}</p>
              <button
                onClick={fetchAnalyticsData}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition"
              >
                Try Again
              </button>
            </div>
          </section>
        ) : (
          <section className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 card-container">
            
           {/* Header & All Filters */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-slate-800/60 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center text-xl shadow-inner">
                    📊
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white title-text">Analytics & Reports</h2>
                    <p className="text-sm text-slate-400 mt-1">Monitor uploads, AI nodes, activity and system usage.</p>
                  </div>
                </div>
              </div>

              {/* Modernized Filters Group */}
              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
                
                {/* File Type Filter */}
                <div className="flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <span className="text-sm">📁</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Type</span>
                    <select
                      value={fileTypeFilter}
                      onChange={(e) => setFileTypeFilter(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm font-medium focus:outline-none cursor-pointer pr-2"
                    >
                      <option value="all" className="bg-slate-900">All Types</option>
                      <option value="images" className="bg-slate-900">Images</option>
                      <option value="pdf" className="bg-slate-900">PDF</option>
                      <option value="other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                </div>

                {/* Node Status Filter - Updated with exact statuses */}
                <div className="flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-900/80 border border-slate-800/80 hover:border-violet-500/40 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <span className="text-sm">⚡</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Status</span>
                    <select
                      value={nodeStatusFilter}
                      onChange={(e) => setNodeStatusFilter(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm font-medium focus:outline-none cursor-pointer pr-2"
                    >
                      <option value="all" className="bg-slate-900">All Nodes</option>
                      <option value="active" className="bg-slate-900">Active</option>
                      <option value="maintenance" className="bg-slate-900">Maintenance</option>
                      <option value="optimizing" className="bg-slate-900">Optimizing</option>
                      <option value="active (updated)" className="bg-slate-900">Active (Updated)</option>
                      <option value="stopped" className="bg-slate-900">Stopped</option>
                    </select>
                  </div>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <span className="text-sm">📅</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Range</span>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm font-medium focus:outline-none cursor-pointer pr-2"
                    >
                      <option value="all" className="bg-slate-900">All Time</option>
                      <option value="7days" className="bg-slate-900">Last 7 Days</option>
                      <option value="30days" className="bg-slate-900">Last 30 Days</option>
                      <option value="90days" className="bg-slate-900">Last 90 Days</option>
                    </select>
                  </div>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={fetchAnalyticsData}
                  className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-slate-300 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer group"
                  title="Refresh Analytics"
                >
                  <span className="group-hover:rotate-180 transition-transform duration-500 text-base">↻</span>
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Total Uploads</p>
                    <h3 className="text-3xl font-black text-white mt-2">{totalUploads}</h3>
                    <p className="text-xs text-indigo-400 mt-2">Files uploaded</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xl">📁</div>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-violet-500/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Total Nodes</p>
                    <h3 className="text-3xl font-black text-white mt-2">{totalNodes}</h3>
                    <p className="text-xs text-violet-400 mt-2">AI cluster nodes</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-xl">🤖</div>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Active Nodes</p>
                    <h3 className="text-3xl font-black text-white mt-2">{activeNodes}</h3>
                    <p className="text-xs text-emerald-400 mt-2">Currently operational</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">⚡</div>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Storage Used</p>
                    <h3 className="text-3xl font-black text-white mt-2">
                      {totalStorageMB} <span className="text-sm font-medium text-slate-400 ml-1">MB</span>
                    </h3>
                    <p className="text-xs text-cyan-400 mt-2">Uploaded file size</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-xl">💾</div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 md:p-6">
              <div className="mb-5">
                <h3 className="text-base font-bold text-white">Upload Activity</h3>
                <p className="text-xs text-slate-500 mt-1">Number of files uploaded over time</p>
              </div>
              <div className="h-[280px] w-full">
                {uploadActivityData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📈</div>
                      <p className="text-sm text-slate-500">No upload activity for this filter selection.</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={uploadActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '10px',
                          color: '#fff',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="uploads"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#6366f1' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Bar & Donut Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 md:p-6">
                <div className="mb-5">
                  <h3 className="text-base font-bold text-white">AI Node Status</h3>
                  <p className="text-xs text-slate-500 mt-1">Distribution of your AI server nodes</p>
                </div>
                <div className="h-[280px] w-full">
                  {nodeStatusData.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-slate-500">No node data available for this filter.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={nodeStatusData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="status" stroke="#64748b" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '10px',
                            color: '#fff',
                          }}
                        />
                        <Bar dataKey="count" name="Nodes" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Donut Chart */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 md:p-6">
                <div className="mb-5">
                  <h3 className="text-base font-bold text-white">File Type Distribution</h3>
                  <p className="text-xs text-slate-500 mt-1">Breakdown of uploaded file formats</p>
                </div>
                <div className="h-[280px] w-full">
                  {fileTypeData.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🍩</div>
                        <p className="text-sm text-slate-500">No files available.</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fileTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                        >
                          {fileTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '10px',
                            color: '#fff',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-slate-800/60">
              <p className="text-xs text-slate-500">Analytics are generated from your authenticated backend data.</p>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Live backend data
              </div>
            </div>

          </section>
        )}
      </main>
    </div>
  );
}