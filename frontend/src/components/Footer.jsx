import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#030712] text-xs font-sans relative pt-6 pb-12">
      {/* Contact aur Footer ke darmiyan Adjustable Divider Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
      </div>

      {/* Centered Gradient Box Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
          
          {/* Subtle Glow inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] pointer-events-none"></div>

          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-8 relative z-10 border-b border-white/15">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm tracking-wide font-mono">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"></span>
                NexusAI Nodes
              </div>
              <p className="text-purple-100 text-[11px] sm:text-xs leading-relaxed max-w-sm">
                Architecting high-performance, low-latency data pipelines and telemetry clusters for next-generation enterprise ecosystems natively.
              </p>
              
              <div className="text-[11px] font-mono text-purple-100 flex items-center gap-2">
                <span className="text-purple-200">Inquiries:</span>
                <a href="mailto:support@nexusai-nodes.io" className="text-white hover:underline transition-colors font-medium">
                  support@nexusai-nodes.io
                </a>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <a href="https://github.com" target="_blank" rel="noreferrer" title="GitHub Repository" className="w-8 h-8 rounded-lg bg-black/20 border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="https://vercel.com" target="_blank" rel="noreferrer" title="Vercel Deployment" className="w-8 h-8 rounded-lg bg-black/20 border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-all">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>
                </a>
              </div>
            </div>

            {/* Right Section Links */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 md:pl-6 w-full">
              <div className="space-y-3">
                <div className="text-white font-medium uppercase tracking-wider text-[10px]">Architecture</div>
                <ul className="space-y-2 text-[11px] sm:text-xs font-sans text-purple-100">
                  <li><a href="#benchmarks" className="hover:text-white transition-colors block">Core Nodes</a></li>
                  <li><a href="#benchmarks" className="hover:text-white transition-colors block">Sub-14ms Benchmarks</a></li>
                  <li><a href="#telemetry" className="hover:text-white transition-colors block">Telemetry Engine</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="text-white font-medium uppercase tracking-wider text-[10px]">Protocols</div>
                <ul className="space-y-2 text-[11px] sm:text-xs font-sans text-purple-100">
                  <li className="text-purple-200">TLS 1.3 Secure</li>
                  <li className="text-purple-200">GraphQL Webhooks</li>
                  <li className="text-purple-200">Vector Isolation</li>
                </ul>
              </div>

              <div className="space-y-3 col-span-2 sm:col-span-1">
                <div className="text-white font-medium uppercase tracking-wider text-[10px]">System Status</div>
                <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/20 flex items-center justify-between text-[11px] text-white w-full max-w-[200px]">
                  <span className="font-sans">Uptime</span>
                  <span className="text-emerald-300 font-semibold tracking-wider font-mono">99.99%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar Centered */}
          <div className="pt-6 text-[10px] sm:text-xs text-purple-100 font-medium flex flex-col items-center justify-center text-center gap-2 relative z-10">
            <div>&lt;/&gt; NexusAI Nodes Ltd. All rights reserved.</div>
            <div className="flex items-center gap-1.5 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Continuous Deployment Active</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}