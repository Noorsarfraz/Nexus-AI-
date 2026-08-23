import React, { useEffect, useMemo, useState } from 'react';
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

export default function AnalyticsDashboard() {
  const [uploads, setUploads] = useState([]);
  const [nodes, setNodes] = useState([]);

  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    '';

  // =====================================================
  // FETCH BACKEND DATA
  // =====================================================

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
        throw new Error(
          uploadsData.error || 'Unable to fetch uploads.'
        );
      }

      if (!nodesRes.ok) {
        throw new Error(
          nodesData.error || 'Unable to fetch nodes.'
        );
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

  // =====================================================
  // DATE FILTER
  // =====================================================

  const filteredUploads = useMemo(() => {
    if (filter === 'all') {
      return uploads;
    }

    const now = new Date();

    const days =
      filter === '7days'
        ? 7
        : filter === '30days'
        ? 30
        : 90;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);

    return uploads.filter((item) => {
      if (!item.createdAt) return false;

      const uploadDate = new Date(item.createdAt);

      return uploadDate >= startDate;
    });
  }, [uploads, filter]);

  // =====================================================
  // STAT CARDS
  // =====================================================

  const totalUploads = filteredUploads.length;

  const totalNodes = nodes.length;

  const activeNodes = nodes.filter((node) => {
    const status = String(node.status || '').toLowerCase();

    return (
      status.includes('active') ||
      status.includes('optimizing') ||
      status.includes('deployed')
    );
  }).length;

  const totalStorage = filteredUploads.reduce(
    (total, item) => total + Number(item.sizeBytes || 0),
    0
  );

  const totalStorageMB = (
    totalStorage /
    (1024 * 1024)
  ).toFixed(2);

  // =====================================================
  // NODE STATUS BAR CHART
  // =====================================================

  const nodeStatusData = useMemo(() => {
    const statusMap = {};

    nodes.forEach((node) => {
      const status = node.status || 'Unknown';

      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    return Object.entries(statusMap).map(
      ([status, count]) => ({
        status,
        count,
      })
    );
  }, [nodes]);

  // =====================================================
  // FILE TYPE DONUT CHART
  // =====================================================

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

    return Object.entries(typeMap).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [filteredUploads]);

  // =====================================================
  // UPLOAD ACTIVITY LINE CHART
  // =====================================================

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
      const formattedDate = new Date(
        `${date}T00:00:00`
      ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        date: formattedDate,
        uploads: activityMap[date],
      };
    });
  }, [filteredUploads]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-sm text-slate-400">
              Loading analytics...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center py-10">
          <div className="text-4xl mb-3">⚠️</div>

          <h2 className="text-lg font-bold text-white mb-2">
            Analytics unavailable
          </h2>

          <p className="text-sm text-red-400 mb-5">
            {error}
          </p>

          <button
            onClick={fetchAnalyticsData}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 card-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row justify-between gap-4 border-b border-slate-800/60 pb-5">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-xl">
              📊
            </div>

            <div>
              <h2 className="text-xl font-bold text-white title-text">
                Analytics & Reports
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Monitor uploads, AI nodes, activity and system usage.
              </p>
            </div>
          </div>
        </div>

        {/* FILTER */}

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400">
            Date Range
          </label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>

          <button
            onClick={fetchAnalyticsData}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition"
            title="Refresh Analytics"
          >
            ↻
          </button>
        </div>
      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total Uploads */}

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Total Uploads
              </p>

              <h3 className="text-3xl font-black text-white mt-2">
                {totalUploads}
              </h3>

              <p className="text-xs text-indigo-400 mt-2">
                Files uploaded
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xl">
              📁
            </div>
          </div>
        </div>

        {/* Total Nodes */}

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-violet-500/30 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Total Nodes
              </p>

              <h3 className="text-3xl font-black text-white mt-2">
                {totalNodes}
              </h3>

              <p className="text-xs text-violet-400 mt-2">
                AI cluster nodes
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-xl">
              🤖
            </div>
          </div>
        </div>

        {/* Active Nodes */}

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Active Nodes
              </p>

              <h3 className="text-3xl font-black text-white mt-2">
                {activeNodes}
              </h3>

              <p className="text-xs text-emerald-400 mt-2">
                Currently operational
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">
              ⚡
            </div>
          </div>
        </div>

        {/* Storage */}

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Storage Used
              </p>

              <h3 className="text-3xl font-black text-white mt-2">
                {totalStorageMB}
                <span className="text-sm font-medium text-slate-400 ml-1">
                  MB
                </span>
              </h3>

              <p className="text-xs text-cyan-400 mt-2">
                Uploaded file size
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-xl">
              💾
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          LINE CHART
      ================================================= */}

      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 md:p-6">

        <div className="mb-5">
          <h3 className="text-base font-bold text-white">
            Upload Activity
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Number of files uploaded over time
          </p>
        </div>

        <div className="h-[280px] w-full">

          {uploadActivityData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>

                <p className="text-sm text-slate-500">
                  No upload activity for this period.
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uploadActivityData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                />

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
                  dot={{
                    r: 4,
                    fill: '#6366f1',
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* =================================================
          BAR + DONUT
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* BAR CHART */}

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 md:p-6">

          <div className="mb-5">
            <h3 className="text-base font-bold text-white">
              AI Node Status
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Distribution of your AI server nodes
            </p>
          </div>

          <div className="h-[280px] w-full">

            {nodeStatusData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-slate-500">
                  No node data available.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nodeStatusData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="status"
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#fff',
                    }}
                  />

                  <Bar
                    dataKey="count"
                    name="Nodes"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* DONUT CHART */}

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 md:p-6">

          <div className="mb-5">
            <h3 className="text-base font-bold text-white">
              File Type Distribution
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Breakdown of uploaded file formats
            </p>
          </div>

          <div className="h-[280px] w-full">

            {fileTypeData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">🍩</div>

                  <p className="text-sm text-slate-500">
                    No files available.
                  </p>
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
                    {fileTypeData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index % COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#fff',
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: '12px',
                      color: '#94a3b8',
                    }}
                  />

                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          FOOTER INFO
      ================================================= */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-slate-800/60">

        <p className="text-xs text-slate-500">
          Analytics are generated from your authenticated
          backend data.
        </p>

        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Live backend data
        </div>

      </div>
    </section>
  );
}