import { useState, useEffect } from 'react';

export default function AIServerMonitor() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // 1. READ: Fetch nodes on load
  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to connect to Nexus AI backend server');
      const data = await res.json();
      setNodes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. CREATE / UPDATE Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        // UPDATE Request
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, status: 'Optimized' })
        });
        if (!res.ok) throw new Error('Failed to update AI node');
        const updated = await res.json();
        setNodes(nodes.map(n => n.id === editingId ? updated : n));
        setEditingId(null);
      } else {
        // CREATE Request
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, status: 'Active' })
        });
        if (!res.ok) throw new Error('Failed to create AI node');
        const newNode = await res.json();
        setNodes([...nodes, newNode]);
      }
      setTitle('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE Handler
  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete AI node');
      setNodes(nodes.filter(n => n.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit Trigger Mode
  const handleEdit = (node) => {
    setEditingId(node.id);
    setTitle(node.title);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 w-full">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Live AI Server Nodes Monitor</h2>
            <p className="text-slate-400 text-xs mt-1">Manage, deploy, and terminate active cluster endpoints securely via backend API.</p>
          </div>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-400 px-3.5 py-1.5 rounded-full border border-indigo-500/30">
            Backend Connected
          </span>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs rounded-xl font-mono">
            Error: {error}
          </div>
        )}

        {/* Form for Create / Update */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter AI Node designation (e.g., GPT-5 Neural Core)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-indigo-600/20"
          >
            {editingId ? 'Update Node' : 'Deploy Node'}
          </button>
        </form>

        {/* Loading State Indicator */}
        {loading && (
          <div className="text-xs text-indigo-400 font-mono mb-6 animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            Syncing telemetry pipeline with server...
          </div>
        )}

        {/* Nodes Dynamic List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.length === 0 && !loading ? (
            <p className="text-slate-500 text-xs col-span-2 text-center py-8 font-mono">No active AI telemetry nodes found.</p>
          ) : (
            nodes.map((node) => (
              <div key={node.id} className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl hover:border-slate-700 transition-all">
                <div>
                  <div className="font-bold text-white text-sm">{node.title}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
                    Status: <span className="text-emerald-400 font-semibold">{node.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(node)} 
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl font-medium text-slate-300 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(node.id)} 
                    className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-xl font-medium transition-colors cursor-pointer border border-rose-500/20"
                  >
                    Terminate
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}