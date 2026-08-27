import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Bot,
  KeyRound,
  User,
  Settings,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  Gauge,
  Users as UsersIcon,
  Sun,
  Moon,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics & Reports', Icon: BarChart3 },
  { path: '/models', label: 'AI Models Hub', Icon: Bot },
  { path: '/api-keys', label: 'API Keys & Tokens', Icon: KeyRound },
  { path: '/profile', label: 'Profile', Icon: User },
  { path: '/settings', label: 'Settings', Icon: Settings },
  { path: '/billing', label: 'Billing', Icon: CreditCard },
];

const ADMIN_SUB_ITEMS = [
  { view: 'overview', label: 'Overview', Icon: Gauge },
  { view: 'users', label: 'Manage Users', Icon: UsersIcon },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, mobileOpen, setMobileOpen, onLogoutClick }) {
  const location = useLocation();
  const role = useNexusStore((state) => state.role);
  const theme = useNexusStore((state) => state.theme);
  const toggleTheme = useNexusStore((state) => state.toggleTheme);

  const isOnAdminPage = location.pathname === '/admin';
  const activeAdminView = new URLSearchParams(location.search).get('view') || 'overview';

  // Auto-expand the Admin group whenever an admin page is active
  const [adminExpanded, setAdminExpanded] = useState(isOnAdminPage);

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
            className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map(({ path, label, Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="text-sm">{label}</span>}
              </Link>
            );
          })}

          {/* --- ADMIN GROUP (Expandable with Sub-Views) --- */}
          {role === 'admin' && (
            <div className="pt-1">
              <button
                onClick={() => (sidebarOpen ? setAdminExpanded((v) => !v) : setSidebarOpen(true))}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  isOnAdminPage
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <ShieldCheck size={18} className="shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm flex-1 text-left">Admin Panel</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${adminExpanded ? 'rotate-0' : '-rotate-90'}`}
                    />
                  </>
                )}
              </button>

              {sidebarOpen && adminExpanded && (
                <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1">
                  {ADMIN_SUB_ITEMS.map(({ view, label, Icon }) => {
                    const isActive = isOnAdminPage && activeAdminView === view;
                    return (
                      <Link
                        key={view}
                        to={`/admin?view=${view}`}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <Icon size={15} className="shrink-0" />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-800/60">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white font-medium transition cursor-pointer"
          aria-label="Toggle light/dark theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {sidebarOpen && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {onLogoutClick && (
          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium transition cursor-pointer"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">Logout Session</span>}
          </button>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex items-center justify-center gap-2 w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-xl transition cursor-pointer border border-slate-700/50"
        >
          {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          {sidebarOpen && 'Collapse'}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
       className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/90 border-r border-slate-800 transition-all duration-300 flex-col justify-between p-4 fixed left-0 top-0 h-screen z-20 backdrop-blur-xl overflow-y-auto`}
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