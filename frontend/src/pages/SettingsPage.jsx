import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';
import Sidebar from '../components/Sidebar';

export default function SettingsPage() {
  useDocumentTitle('Settings');
  const [darkMode, setDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('nexus_dark_mode');
    const savedAlerts = localStorage.getItem('nexus_email_alerts');
    
    if (savedTheme !== null) {
      const isDark = savedTheme === 'true';
      setDarkMode(isDark);
      applyTheme(isDark);
    }
    if (savedAlerts !== null) {
      setEmailAlerts(savedAlerts === 'true');
    }
  }, []);

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  };

  // Direct toggle handler for instant action
  const handleThemeToggle = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('nexus_dark_mode', newTheme);
    applyTheme(newTheme);
    setStatusMsg(newTheme ? 'Dark Mode Enabled' : 'Light Mode Enabled');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleAlertsToggle = () => {
    const newAlerts = !emailAlerts;
    setEmailAlerts(newAlerts);
    localStorage.setItem('nexus_email_alerts', newAlerts);
    setStatusMsg(newAlerts ? 'Email Notifications Enabled' : 'Email Notifications Disabled');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleSave = () => {
    localStorage.setItem('nexus_dark_mode', darkMode);
    localStorage.setItem('nexus_email_alerts', emailAlerts);
    applyTheme(darkMode);

    setStatusMsg('Preferences saved successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      localStorage.clear();
      alert('Account deleted successfully.');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] dark-transition text-slate-200 flex relative">
      
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <main className={`flex-1 w-full min-w-0 p-6 md:p-10 relative transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden mb-2 flex items-center gap-2 text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl cursor-pointer w-fit"
        >
          ☰ <span className="text-sm">Menu</span>
        </button>

        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl card-container">
            <div>
              <h1 className="text-2xl font-black text-white title-text">System Settings</h1>
              <p className="text-sm text-slate-400 mt-1">Configure your application theme and alerts.</p>
            </div>
            <Link to="/dashboard" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl transition border border-slate-700 btn-back font-medium">
              ← Back to Dashboard
            </Link>
          </div>

          {statusMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl shadow-lg flex items-center gap-2">
              <span>✓</span> {statusMsg}
            </div>
          )}

          {/* Toggles Section */}
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl card-container">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 title-text">Preferences</h2>

            {/* Dark/Light Mode Toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-white title-text">Dark / Light Mode Theme</p>
                <p className="text-xs text-slate-400">Enable high-contrast dark telemetry theme.</p>
              </div>
              <button
                type="button"
                onClick={handleThemeToggle}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${darkMode ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </button>
            </div>

            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-slate-800/60 pt-4">
              <div>
                <p className="text-sm font-medium text-white title-text">Email Notifications</p>
                <p className="text-xs text-slate-400">Receive alerts regarding node failures or security patches.</p>
              </div>
              <button
                type="button"
                onClick={handleAlertsToggle}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${emailAlerts ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </button>
            </div>

            <button 
              onClick={handleSave} 
              className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              Save Preferences
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-slate-900 border border-red-500/30 p-6 md:p-8 rounded-2xl space-y-4 shadow-xl card-container">
            <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
            <p className="text-xs text-slate-400">Once you delete your account, there is no going back. Please be certain.</p>
            
            <button 
              onClick={handleDeleteAccount}
              className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 rounded-xl text-sm font-medium transition cursor-pointer"
            >
              Delete Account
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}