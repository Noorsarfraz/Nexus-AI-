import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function BillingPage() {
  useDocumentTitle('Billing');
  const [currentPlan, setCurrentPlan] = useState('Developer');
  const [successMsg, setSuccessMsg] = useState('');
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Payment Modal States
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('jazzcash');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('nexus_user_plan');
    if (savedPlan) {
      setCurrentPlan(savedPlan);
    }
  }, []);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API request with API_URL readiness
    setTimeout(() => {
      setLoading(false);
      setShowPayModal(false);
      setCurrentPlan('Enterprise');
      localStorage.setItem('nexus_user_plan', 'Enterprise');
      setSuccessMsg('Successfully upgraded to Enterprise Tier via ' + selectedMethod.toUpperCase() + '!');
      setAccountNumber('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  const handleDowngrade = (planName) => {
    setCurrentPlan(planName);
    localStorage.setItem('nexus_user_plan', planName);
    setSuccessMsg(`Switched back to ${planName} Tier.`);
    setTimeout(() => setSuccessMsg(''), 3000);
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

      {/* Main Content Area - Fixed double scrollbar & added dynamic sidebar margin */}
      <main className={`flex-1 w-full min-w-0 p-6 md:p-10 relative transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden mb-2 flex items-center gap-2 text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl cursor-pointer w-fit"
        >
          ☰ <span className="text-sm">Menu</span>
        </button>
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Top Header */}
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl card-container">
            <div>
              <h1 className="text-2xl font-black text-white title-text">Billing & Subscriptions</h1>
              <p className="text-sm text-slate-400 mt-1">Manage your active tier, regional payments, and server resource allocation.</p>
            </div>
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl transition border border-slate-700 font-medium"
            >
              <span>←</span> Back to Dashboard
            </Link>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl flex items-center gap-2 shadow-lg">
              <span>✓</span> {successMsg}
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Developer Tier */}
            <div className={`bg-slate-900 p-8 rounded-2xl space-y-4 relative shadow-xl transition card-container border ${currentPlan === 'Developer' ? 'border-indigo-500/80' : 'border-slate-800'}`}>
              {currentPlan === 'Developer' && (
                <span className="absolute top-6 right-6 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full font-mono">
                  CURRENT PLAN
                </span>
              )}
              <h2 className="text-xl font-bold text-white title-text">Developer Tier</h2>
              <p className="text-3xl font-black text-white">$0 <span className="text-xs font-normal text-slate-400">/ month</span></p>
              <p className="text-sm text-slate-400">Includes standard API endpoints, up to 5 live server nodes, and basic JWT security.</p>
              
              {currentPlan === 'Developer' ? (
                <button 
                  onClick={() => setShowActiveModal(true)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-medium rounded-xl text-sm transition cursor-pointer border border-indigo-500/30 shadow-md"
                >
                  View Active Plan Details
                </button>
              ) : (
                <button 
                  onClick={() => handleDowngrade('Developer')} 
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm transition cursor-pointer border border-slate-700"
                >
                  Downgrade to Free
                </button>
              )}
            </div>

            {/* Enterprise Tier */}
            <div className={`bg-slate-900 p-8 rounded-2xl space-y-4 relative shadow-xl transition card-container border ${currentPlan === 'Enterprise' ? 'border-indigo-500/80' : 'border-slate-800'}`}>
              {currentPlan === 'Enterprise' && (
                <span className="absolute top-6 right-6 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full font-mono">
                  CURRENT PLAN
                </span>
              )}
              <h2 className="text-xl font-bold text-white title-text">Enterprise Tier</h2>
              <p className="text-3xl font-black text-white">$49 <span className="text-xs font-normal text-slate-400">/ month</span></p>
              <p className="text-sm text-slate-400">Unlimited AI cluster nodes, dedicated telemetry streams, and priority support.</p>
              
              {currentPlan === 'Enterprise' ? (
                <button 
                  onClick={() => setShowActiveModal(true)}
                  className="w-full py-2.5 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 font-medium rounded-xl text-sm transition cursor-pointer border border-indigo-500/40 shadow-md"
                >
                  View Active Plan Details
                </button>
              ) : (
                <button 
                  onClick={() => setShowPayModal(true)} 
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  Upgrade Now ($49/mo)
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Payment Gateway Modal (JazzCash / EasyPaisa / PayPal) */}
        {showPayModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Select Payment Gateway</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Enterprise Plan - $49 / month</p>
                </div>
                <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-white text-lg cursor-pointer">✕</button>
              </div>

              {/* Gateway Selectors */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('jazzcash')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center gap-1 ${selectedMethod === 'jazzcash' ? 'bg-red-600/20 border-red-500 text-red-400 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <span>🔴 JazzCash</span>
                  <span className="text-[10px] font-normal text-slate-500">PKR (Rs. 13,800)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedMethod('easypaisa')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center gap-1 ${selectedMethod === 'easypaisa' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <span>🟢 EasyPaisa</span>
                  <span className="text-[10px] font-normal text-slate-500">PKR (Rs. 13,800)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('paypal')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center gap-1 ${selectedMethod === 'paypal' ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <span>🔵 PayPal</span>
                  <span className="text-[10px] font-normal text-slate-500">USD ($49.00)</span>
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Selected Method:</span>
                    <span className="text-white font-bold uppercase">{selectedMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="text-white font-bold">
                      {selectedMethod === 'paypal' ? '$49.00 USD' : 'Rs. 13,800 PKR'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    {selectedMethod === 'paypal' ? 'PayPal Account Email' : `${selectedMethod.toUpperCase()} Mobile Number`}
                  </label>
                  <input
                    type={selectedMethod === 'paypal' ? 'email' : 'text'}
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={selectedMethod === 'paypal' ? 'name@example.com' : '03XX-XXXXXXX'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition cursor-pointer border border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : `Confirm Payment`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Active Plan Details Modal */}
        {showActiveModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white">Subscription Details</h3>
                <button onClick={() => setShowActiveModal(false)} className="text-slate-400 hover:text-white text-lg cursor-pointer">✕</button>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Active Tier:</span>
                  <span className="font-bold text-indigo-400">{currentPlan} Plan</span>
                </div>
                <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-400">Active & Healthy</span>
                </div>
                <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Billing Cycle:</span>
                  <span>Monthly Auto-Renewal</span>
                </div>
                <div className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Node Limit:</span>
                  <span className="font-mono">{currentPlan === 'Enterprise' ? 'Unlimited' : '5 Nodes Max'}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    alert('Invoice downloaded successfully.');
                    setShowActiveModal(false);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition cursor-pointer border border-slate-700"
                >
                  Download Invoice
                </button>
                <button
                  onClick={() => setShowActiveModal(false)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}