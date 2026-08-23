import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function ProfilePage() {
  useDocumentTitle('Profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passMsg, setPassMsg] = useState('');

  useEffect(() => {
    // Active session se email aur user name fetch karna
    const currentEmail = localStorage.getItem('userEmail') || 'user@nexus.ai';
    const savedName = localStorage.getItem(`nexus_user_name_${currentEmail}`) || currentEmail.split('@')[0];
    
    setName(savedName);
    setEmail(currentEmail);
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem(`nexus_user_name_${email}`, name);
    
    setSuccessMsg('Profile details updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassMsg('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg('New password and confirm password do not match!');
      return;
    }

    try {
      // Active session ka token retrieve karein
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/change-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Active session token attached here
        },
        body: JSON.stringify({ email, currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPassMsg('Password changed successfully in active session!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassMsg(''), 3000);
    } catch (err) {
      setPassMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">User Profile</h1>
            <p className="text-sm text-slate-400">Manage your personal information and account security.</p>
          </div>
          <Link to="/dashboard" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl transition border border-slate-700">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Profile Info Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Personal Information</h2>
          
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="flex items-center gap-4 pb-2">
              <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/40 rounded-full flex items-center justify-center text-indigo-400 font-bold text-xl uppercase">
                {email ? email.charAt(0) : 'U'}
              </div>
              <div>
                <p className="text-white font-medium">{email}</p>
                <p className="text-xs text-slate-400 font-mono">BSIT Morning Student / Developer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address (Locked)</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-slate-400 text-sm cursor-not-allowed select-none"
                  title="Email address cannot be changed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Email is tied to your account session and cannot be modified.</span>
              </div>
            </div>

            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-lg shadow-indigo-600/30">
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Change Password</h2>

          {passMsg && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs rounded-xl">
              {passMsg}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Enter current password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Type current password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  {showCurrent ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Enter new password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Type new password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  {showNew ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  {showConfirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition cursor-pointer border border-slate-700">
              Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}