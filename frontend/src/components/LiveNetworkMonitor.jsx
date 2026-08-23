import React, { useState, useEffect, useCallback } from 'react';

export default function LiveNetworkMonitor() {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [latency, setLatency] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [screenRes, setScreenRes] = useState('1920 x 1080');

  // Screen resolution safely handle in browser environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenRes(`${window.screen.width} x ${window.screen.height} px`);
    }
  }, []);

  // Fetch Network Diagnostics using useCallback to fix dependency array
  const fetchDiagnostics = useCallback(() => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    fetch('https://ipwho.is/')
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message || 'Network diagnostics not fetch!');
        }
        setIpData(data);
        setLatency(Date.now() - startTime);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to connect to diagnostic node.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  // Helper: Client Browser & OS Detector
  const getBrowserInfo = () => {
    if (typeof navigator === 'undefined') return { browser: 'Unknown', os: 'Unknown' };
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (ua.includes('Chrome')) browser = 'Google Chrome';
    else if (ua.includes('Safari')) browser = 'Apple Safari';
    else if (ua.includes('Edge')) browser = 'Microsoft Edge';

    let os = 'Unknown OS';
    if (ua.includes('Win')) os = 'Windows OS';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Android')) os = 'Android OS';
    else if (ua.includes('Linux')) os = 'Linux OS';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return { browser, os };
  };

  const clientEnv = getBrowserInfo();

  // Copy to Clipboard
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export Report as JSON
  const handleExportJSON = () => {
    const report = {
      timestamp: new Date().toISOString(),
      network: ipData,
      system: {
        browser: clientEnv.browser,
        os: clientEnv.os,
        screenResolution: screenRes,
        cookiesEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false,
        onlineStatus: typeof navigator !== 'undefined' && navigator.onLine ? 'Online' : 'Offline',
      },
      security: {
        protocol: typeof window !== 'undefined' ? window.location.protocol.replace(':', '').toUpperCase() : 'HTTPS',
        sslSecure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : true,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `live-network-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const currentProtocol = typeof window !== 'undefined' ? window.location.protocol.replace(':', '').toUpperCase() : 'HTTPS';

  // Diagnostic Metrics List
  const diagnosticItems = ipData
    ? [
        { label: 'Public IP Address', value: ipData.ip, category: 'network' },
        { label: 'ISP / Provider', value: ipData.connection?.isp || ipData.connection?.org || 'N/A', category: 'network' },
        { label: 'Network ASN', value: `AS${ipData.connection?.asn || 'N/A'}`, category: 'network' },
        { label: 'Gateway Latency', value: `${latency} ms`, category: 'network' },

        { label: 'City / Region', value: `${ipData.city || 'N/A'}, ${ipData.region || ''}`, category: 'network' },
        { label: 'Country Specs', value: `${ipData.country || 'N/A'} (${ipData.country_code || 'N/A'})`, category: 'network' },
        { label: 'Timezone', value: ipData.timezone?.id || 'N/A', category: 'network' },

        { label: 'Client OS', value: clientEnv.os, category: 'system' },
        { label: 'Client Browser', value: clientEnv.browser, category: 'system' },
        { label: 'Display Resolution', value: screenRes, category: 'system' },
        { label: 'Browser Cookies', value: typeof navigator !== 'undefined' && navigator.cookieEnabled ? 'Enabled ✅' : 'Disabled ❌', category: 'system' },

        { label: 'Transfer Protocol', value: currentProtocol, category: 'security' },
        { label: 'SSL/TLS Encryption', value: isHttps ? 'Secure (HTTPS) 🔒' : 'Unencrypted ⚠️', category: 'security' },
        { label: 'SOC2 / ISO Readiness', value: 'Compliant Tenant Gateway', category: 'security' },
      ]
    : [];

  // Filter Logic
  const filteredItems = diagnosticItems.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch =
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      String(item.value).toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section className="w-full py-16 px-4 sm:px-6 bg-[#030712] flex flex-col items-center justify-center border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 w-full">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                LIVE NETWORK MONITOR
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Real-time API & Client Node Diagnostics for Network & Security Verification.
            </p>
          </div>

          {!loading && !error && ipData && (
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-2 shrink-0"
            >
              📥 Export JSON Report
            </button>
          )}
        </div>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <input
            type="text"
            placeholder="Filter diagnostics (e.g. IP, ISP, OS...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm"
          />
          <button
            onClick={fetchDiagnostics}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 shrink-0"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
            {loading ? 'Testing...' : 'Re-test Connection'}
          </button>
        </div>

        {/* Tabs */}
        {!loading && !error && ipData && (
          <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto w-full">
            {['all', 'network', 'system', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'all' ? 'All Metrics' : tab}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 text-indigo-400 font-medium text-lg animate-pulse">
            ⏳ Running Network & Diagnostic Health Check...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto text-center p-5 bg-red-950/50 border border-red-800 text-red-400 rounded-xl space-y-3">
            <p className="font-bold">⚠️ Connection Diagnostic Error</p>
            <p className="text-xs text-red-300">{error}</p>
            <button
              onClick={fetchDiagnostics}
              className="px-4 py-1.5 bg-red-800 hover:bg-red-700 text-white text-xs rounded-lg transition"
            >
              Retry Diagnostic Test
            </button>
          </div>
        )}

        {/* Diagnostics Output */}
        {!loading && !error && ipData && (
          <div className="space-y-6 w-full">
            
            {/* Gateway Overview Bar */}
            <div className="p-4 bg-slate-900/80 border border-indigo-500/30 rounded-xl flex flex-wrap justify-between items-center gap-4 w-full">
              <div>
                <span className="text-xs text-slate-400 uppercase font-mono">Gateway IP Address:</span>
                <p className="text-xl font-bold text-emerald-400 font-mono">{ipData.ip}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-ping"></span>
                  HEALTHY
                </span>
                <span className="px-3 py-1 bg-slate-800 text-indigo-300 border border-slate-700 rounded-full text-xs font-mono font-semibold">
                  ⚡ Ping: {latency}ms
                </span>
                <span className="px-3 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded-full text-xs font-bold uppercase">
                  {ipData.country_code || 'GLOBAL'} REGION
                </span>
              </div>
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition group relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          {item.category}
                        </span>
                        <button
                          onClick={() => handleCopy(item.value, index)}
                          className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded transition"
                        >
                          {copiedKey === index ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <h3 className="text-xs text-slate-400 font-medium">{item.label}</h3>
                    </div>
                    <p className="text-sm md:text-base font-bold text-slate-100 mt-2 font-mono break-all">
                      {item.value}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-slate-500 py-12 bg-slate-900/40 rounded-xl border border-slate-800">
                  🔍 No Results Found
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}