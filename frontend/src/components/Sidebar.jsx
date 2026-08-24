import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/analytics', label: 'Analytics & Reports', icon: '📈' },
  { path: '/models', label: 'AI Models Hub', icon: '🤖' },
  { path: '/api-keys', label: 'API Keys & Tokens', icon: '🔑' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
  { path: '/billing', label: 'Billing', icon: '💳' },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, mobileOpen, setMobileOpen, onLogoutClick }) {
  const location = useLocation();

  const SidebarContent = () => (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
              N
            </div>
            {sidebarOpen && <span className="text-xl font-black text-white title-text tracking-wide">NexusAI</span>}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white text-xl leading-none px-1 cursor-pointer"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
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
        {onLogoutClick && (
          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium transition cursor-pointer"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span className="text-sm">Logout Session</span>}
          </button>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:block w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-xl transition cursor-pointer border border-slate-700/50"
        >
          {sidebarOpen ? '◀ Collapse' : '▶'}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/90 border-r border-slate-800 transition-all duration-300 flex-col justify-between p-4 sticky top-0 h-screen z-20 backdrop-blur-xl relative`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile off-canvas drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 w-72 max-w-[80vw] bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between p-4 h-screen overflow-y-auto backdrop-blur-xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}