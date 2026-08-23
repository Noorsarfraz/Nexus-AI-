import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useNexusStore } from '../store/nexusStore';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import FileUpload from '../components/FileUpload';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { nodes, isLoading, fetchNodes, createNode, deleteNode, updateNode, logoutUser } = useNexusStore();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail') || 'Authenticated User';
    setUserEmail(storedEmail);
    fetchNodes();
  }, [fetchNodes]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createNode(newTitle);
    setNewTitle('');
  };

  const confirmLogout = () => {
    logoutUser();
    setShowLogoutModal(false);
    window.location.href = '/'; 
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

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
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium transition cursor-pointer"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span className="text-sm">Logout Session</span>}
          </button>

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
        
        {/* Top Welcome Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl gap-4 shadow-xl card-container">
          <div>
            <h1 className="text-2xl font-black text-white title-text">
              Welcome back, <span className="text-indigo-400">{userEmail}</span> 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Secure JWT telemetry session active. Monitor and orchestrate your cluster endpoints below.
            </p>
          </div>
          
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium rounded-xl shadow-lg shadow-red-900/30 transition-all cursor-pointer border border-red-500/30 text-sm"
          >
            Logout Session
          </button>
        </div>

        {/* AI Server Nodes Monitor Section */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 card-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/60 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white title-text">Live AI Server Nodes Monitor</h2>
              <p className="text-sm text-slate-400">Manage, deploy, and terminate active cluster endpoints securely via backend API.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Backend Connected
            </span>
          </div>

          <form onSubmit={handleCreateSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter AI Node designation (e.g., GPT-5 Neural Core)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition shadow-inner"
            />
            <button
              type="button"
              onClick={() => navigate('/deploy-node')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition cursor-pointer text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <span>⚡</span> Deploy Node
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {isLoading ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : nodes.length === 0 ? (
              <EmptyState onAction={() => navigate('/deploy-node')} />
            ) : (
              nodes.map((node) => (
                <div key={node._id} className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between gap-4 shadow-md hover:border-slate-700 transition">
                  {editingId === node._id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                      <button onClick={() => updateNode(node._id, editTitle, () => setEditingId(null))} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg transition cursor-pointer font-medium">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition cursor-pointer">Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-white title-text text-base flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        {node.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Status: <span className="text-emerald-400 font-medium">{node.status}</span></p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => navigate(`/deploy-node?editId=${node._id}`)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition cursor-pointer border border-slate-700/60 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNode(node._id)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg transition cursor-pointer border border-rose-500/20 font-medium"
                    >
                      Terminate
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Secure File & Config Upload Component - Full Width Clean Integration */}
        <div className="w-full">
          <FileUpload />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-6 card-container">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 text-xl font-bold shadow-inner">
              !
            </div>
            <div>
              <h3 className="text-lg font-bold text-white title-text">End Secure Session?</h3>
              <p className="text-sm text-slate-400 mt-1">Are you sure you want to terminate this active authentication session?</p>
            </div>
           <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition cursor-pointer border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-lg shadow-red-600/30"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}