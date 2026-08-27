import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Gauge,
  Users,
  Server,
  UploadCloud,
  ShieldCheck,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
  X,
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';

const ADMIN_NAV_ITEMS = [
  { view: 'dashboard', label: 'Dashboard', Icon: Gauge },
  { view: 'users', label: 'Users', Icon: Users },
  { view: 'nodes', label: 'AI Nodes', Icon: Server },
  { view: 'uploads', label: 'Uploads', Icon: UploadCloud },
  { view: 'admins', label: 'Admin Management', Icon: ShieldCheck },
];

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileOpen,
  setMobileOpen,
  onLogoutClick,
}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const activeView = searchParams.get('view') || 'dashboard';

  const theme = useNexusStore((state) => state.theme);
  const toggleTheme = useNexusStore((state) => state.toggleTheme);

  const SidebarContent = () => (
    <>
      {/* TOP SECTION */}
      <div className="space-y-8">
        {/* LOGO */}
        <div className="flex items-center justify-between px-2">
          <Link
            to="/admin?view=dashboard"
            className="flex items-center gap-3 min-w-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck size={18} />
            </div>

            {sidebarOpen && (
              <div className="min-w-0">
                <span className="text-lg font-black text-white title-text tracking-wide block leading-tight">
                  Admin Panel
                </span>

                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  NexusAI
                </span>
              </div>
            )}
          </Link>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-1.5">
          {ADMIN_NAV_ITEMS.map(({ view, label, Icon }) => {
            const isActive =
              location.pathname === '/admin' &&
              activeView === view;

            return (
              <Link
                key={view}
                to={`/admin?view=${view}`}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3
                  px-3 py-2.5
                  rounded-xl
                  font-medium
                  transition-all
                  whitespace-nowrap
                  ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />

                {sidebarOpen && (
                  <span className="text-sm">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-3 pt-4 border-t border-slate-800/60">

        {/* BACK TO APP */}
        <Link
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="
            w-full
            flex items-center gap-3
            px-3 py-2.5
            rounded-xl
            bg-slate-800/60
            hover:bg-slate-800
            text-slate-300
            hover:text-white
            font-medium
            transition
            whitespace-nowrap
          "
        >
          <ArrowLeft size={18} className="shrink-0" />

          {sidebarOpen && (
            <span className="text-sm">
              Back to App
            </span>
          )}
        </Link>

        {/* THEME */}
        <button
          onClick={toggleTheme}
          className="
            w-full
            flex items-center gap-3
            px-3 py-2.5
            rounded-xl
            bg-slate-800/60
            hover:bg-slate-800
            text-slate-300
            hover:text-white
            font-medium
            transition
            cursor-pointer
            whitespace-nowrap
          "
          aria-label="Toggle light/dark theme"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="shrink-0" />
          ) : (
            <Moon size={18} className="shrink-0" />
          )}

          {sidebarOpen && (
            <span className="text-sm">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* LOGOUT */}
        {onLogoutClick && (
          <button
            onClick={onLogoutClick}
            className="
              w-full
              flex items-center gap-3
              px-3 py-2.5
              rounded-xl
              bg-red-500/10
              hover:bg-red-500/20
              text-red-400
              border border-red-500/20
              font-medium
              transition
              cursor-pointer
              whitespace-nowrap
            "
          >
            <LogOut size={18} className="shrink-0" />

            {sidebarOpen && (
              <span className="text-sm">
                Logout Session
              </span>
            )}
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}
      <aside
        className={`
          hidden md:flex
          shrink-0
          ${sidebarOpen ? 'w-64' : 'w-20'}
          bg-slate-900/90
          border-r border-slate-800
          transition-all duration-300
          flex-col
          justify-between
          p-4
          sticky top-0
          h-screen
          z-30
          backdrop-blur-xl
          overflow-hidden
        `}
      >
        <SidebarContent />
      </aside>

      {/* =====================================================
          MOBILE SIDEBAR
          ===================================================== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">

          {/* OVERLAY */}
          <div
            className="
              fixed inset-0
              bg-black/70
              backdrop-blur-sm
            "
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* MOBILE MENU */}
          <aside
            className="
              relative
              z-50
              w-72
              max-w-[80vw]
              bg-slate-900/95
              border-r border-slate-800
              flex flex-col
              justify-between
              p-4
              h-screen
              overflow-y-auto
              backdrop-blur-xl
            "
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}